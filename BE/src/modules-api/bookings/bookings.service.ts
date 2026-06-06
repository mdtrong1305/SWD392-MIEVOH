import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  Inject,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../modules-system/prisma/prisma.service';
import { CreateBookingDto } from './dto/bookings.dto';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { PaymentsService } from '../payments/payments.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly paymentsService: PaymentsService,
  ) {}

  async getSeatsStatus(showtimeId: string) {
    const showtime = await this.prisma.showtime.findUnique({
      where: { showtimeId },
      include: { Cinema: { include: { Seats: true } } },
    });

    if (!showtime) throw new NotFoundException('Không tìm thấy suất chiếu');

    const seats = showtime.Cinema?.Seats || [];

    // lấy các ghế đã bán (trạng thái hóa đơn là success)
    const soldBookingDetails = await this.prisma.bookingDetail.findMany({
      where: {
        Booking: {
          showtimeId,
          paymentStatus: 'Success',
        },
      },
    });
    const soldSeatIds = new Set(soldBookingDetails.map((b) => b.seatId));

    // duyệt qua từng ghế để gắn trạng thái (trống / đang chọn / đã bán)
    const result = await Promise.all(
      seats.map(async (seat) => {
        let status = 'AVAILABLE';
        if (soldSeatIds.has(seat.seatId)) {
          status = 'SOLD';
        } else {
          // kiểm tra cache redis xem có ai đang giữ ghế này không
          const isHeld = await this.cacheManager.get(
            `hold:${showtimeId}:${seat.seatId}`,
          );
          if (isHeld) {
            status = 'HELD';
          }
        }

        return {
          seatId: seat.seatId,
          name: seat.name,
          seatType: seat.seatType,
          status,
        };
      }),
    );

    return result;
  }

  async createBooking(
    username: string,
    data: CreateBookingDto,
    ipAddr: string,
  ) {
    const showtime = await this.prisma.showtime.findUnique({
      where: { showtimeId: data.showtimeId },
    });
    if (!showtime) throw new NotFoundException('Không tìm thấy suất chiếu');

    // kiểm tra tranh chấp ghế đồng thời để tránh bán trùng
    // truy vấn cơ sở dữ liệu xem có ghế nào đã được thanh toán thành công chưa
    const soldSeats = await this.prisma.bookingDetail.findMany({
      where: {
        seatId: { in: data.seats },
        Booking: { showtimeId: data.showtimeId, paymentStatus: 'Success' },
      },
    });
    if (soldSeats.length > 0) {
      throw new ConflictException(
        'Một số ghế bạn chọn đã có người thanh toán thành công!',
      );
    }

    // truy vấn redis xem có ghế nào đang bị khóa tạm thời bởi người khác không
    for (const seatId of data.seats) {
      const heldBy = await this.cacheManager.get(
        `hold:${data.showtimeId}:${seatId}`,
      );
      if (heldBy && heldBy !== username) {
        throw new ConflictException(
          'Ghế bạn chọn đang được khách hàng khác giữ để thanh toán. Vui lòng chọn ghế khác hoặc thử lại sau 5 phút.',
        );
      }
    }

    // tính toán tổng giá tiền của các ghế đã chọn
    let totalPrice = showtime.ticketPrice! * data.seats.length;

    // tính toán và cộng dồn giá tiền của các món đồ ăn đi kèm
    const foodDetails: any[] = [];
    if (data.foods && data.foods.length > 0) {
      for (const food of data.foods) {
        const foodItem = await this.prisma.food.findUnique({
          where: { foodId: food.foodId },
        });
        if (!foodItem)
          throw new NotFoundException(`Món ăn ${food.foodId} không tồn tại`);

        totalPrice += foodItem.price * food.quantity;
        foodDetails.push({
          foodId: food.foodId,
          quantity: food.quantity,
          price: foodItem.price,
        });
      }
    }

    // khóa toàn bộ các ghế đã chọn trên redis với thời gian sống là 5 phút (300,000 mili giây)
    for (const seatId of data.seats) {
      await this.cacheManager.set(
        `hold:${data.showtimeId}:${seatId}`,
        username,
        300000,
      );
    }

    // khởi tạo hóa đơn vào cơ sở dữ liệu với trạng thái chờ thanh toán
    const tempTicketCode = `PENDING-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const booking = await this.prisma.booking.create({
      data: {
        username,
        showtimeId: data.showtimeId,
        totalPrice,
        paymentStatus: 'Pending',
        ticketCode: tempTicketCode,
        BookingDetails: {
          create: data.seats.map((seatId) => ({
            seatId,
            price: showtime.ticketPrice!,
          })),
        },
        BookingFoods: {
          create: foodDetails,
        },
      },
      include: {
        BookingDetails: true,
        BookingFoods: true,
      },
    });

    // tự động tạo url thanh toán vnpay
    const payment = await this.paymentsService.createPaymentUrl(
      booking.bookingId,
      ipAddr,
    );

    return {
      message: 'Tạo đơn hàng thành công, vui lòng thanh toán qua VNPay.',
      booking,
      paymentUrl: payment.url,
    };
  }

  async getMyHistory(username: string) {
    const bookings = await this.prisma.booking.findMany({
      where: { username },
      orderBy: { createdAt: 'desc' },
      include: {
        Showtime: {
          include: {
            Movie: {
              select: { title_vi: true, title_en: true, imageUrl: true },
            },
            Cinema: {
              include: {
                CinemaComplex: { select: { name: true, address: true } },
              },
            },
          },
        },
        BookingDetails: {
          include: { Seat: { select: { name: true, seatType: true } } },
        },
        BookingFoods: {
          include: { Food: { select: { name: true, imageUrl: true } } },
        },
      },
    });

    return bookings;
  }

  // Chạy mỗi phút 1 lần để quét các hóa đơn Pending quá hạn 5 phút
  @Cron(CronExpression.EVERY_MINUTE)
  async handleExpiredBookings() {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    const expiredBookings = await this.prisma.booking.findMany({
      where: {
        paymentStatus: 'Pending',
        createdAt: {
          lt: fiveMinutesAgo, // Tạo trước thời điểm 5 phút trước
        },
      },
    });

    if (expiredBookings.length > 0) {
      const expiredBookingIds = expiredBookings.map((b) => b.bookingId);

      await this.prisma.booking.updateMany({
        where: {
          bookingId: { in: expiredBookingIds },
        },
        data: {
          paymentStatus: 'Failed',
        },
      });
    }
  }
}
