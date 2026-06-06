import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/bookings.dto';
import { RoleGuard } from '../../common/guards/role.guard';
import { Roles } from '../../common/decorators/role.decorator';
import { Public } from '../../common/decorators/public.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get('/seats-status/:showtimeId')
  @Public()
  @ApiOperation({ summary: 'Lấy trạng thái tất cả ghế của suất chiếu (Kiểm tra DB + Redis)' })
  @ApiResponse({ status: 200, description: 'Lấy dữ liệu thành công' })
  getSeatsStatus(@Param('showtimeId') showtimeId: string) {
    return this.bookingsService.getSeatsStatus(showtimeId);
  }

  @Post()
  @UseGuards(RoleGuard)
  @Roles('user', 'admin', 'staff')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Đặt vé (Khóa ghế 5 phút và tự động sinh URL VNPay)' })
  @ApiResponse({ status: 201, description: 'Đặt vé thành công, trả về Booking kèm URL VNPay' })
  @ApiResponse({ status: 409, description: 'Trùng lịch / Khách khác đang giữ ghế' })
  createBooking(@Req() req: any, @Body() data: CreateBookingDto) {
    const username = req.user.username; // Lấy từ Token
    const ipAddr =
      req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress ||
      '127.0.0.1';
    return this.bookingsService.createBooking(username, data, ipAddr);
  }

  @Get('my-history')
  @UseGuards(RoleGuard)
  @Roles('user', 'admin', 'staff')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Lấy lịch sử đặt vé của người dùng hiện tại' })
  @ApiResponse({ status: 200, description: 'Lấy danh sách thành công' })
  getMyHistory(@Req() req: any) {
    const username = req.user.username;
    return this.bookingsService.getMyHistory(username);
  }
}
