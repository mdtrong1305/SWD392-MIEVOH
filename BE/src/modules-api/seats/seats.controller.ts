import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { SeatsService } from './seats.service';
import { CreateSeatDto, GenerateSeatsDto, UpdateSeatDto } from './dto/seats.dto';
import { RoleGuard } from '../../common/guards/role.guard';
import { Roles } from '../../common/decorators/role.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { ApiBearerAuth, ApiExtraModels, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Seats')
@ApiExtraModels(CreateSeatDto, UpdateSeatDto, GenerateSeatsDto)
@Controller('seats')
export class SeatsController {
  constructor(private readonly seatsService: SeatsService) {}

  @Post('/generate')
  @UseGuards(RoleGuard)
  @Roles('admin', 'staff')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Tạo sơ đồ ghế tự động cho rạp (ADMIN, STAFF)' })
  @ApiResponse({ status: 201, description: 'Tạo danh sách ghế thành công' })
  @ApiResponse({ status: 400, description: 'Dữ liệu cấu hình không hợp lệ' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy rạp chiếu' })
  generateSeats(@Body() body: GenerateSeatsDto) {
    return this.seatsService.generateSeats(body);
  }

  @Get()
  @UseGuards(RoleGuard)
  @Roles('admin', 'staff')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Lấy toàn bộ sơ đồ ghế tĩnh của một rạp (ADMIN, STAFF)' })
  @ApiQuery({ name: 'cinemaId', required: true, description: 'Mã rạp chiếu (Phòng chiếu)' })
  @ApiResponse({ status: 200, description: 'Lấy danh sách thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy rạp chiếu' })
  findAllByCinemaId(@Query('cinemaId') cinemaId: string) {
    return this.seatsService.findAllByCinemaId(cinemaId);
  }

  @Post()
  @UseGuards(RoleGuard)
  @Roles('admin', 'staff')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Thêm 1 ghế thủ công (ADMIN, STAFF)' })
  @ApiResponse({ status: 201, description: 'Tạo ghế thành công' })
  @ApiResponse({ status: 400, description: 'Tên ghế đã tồn tại' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy rạp chiếu' })
  createSeat(@Body() body: CreateSeatDto) {
    return this.seatsService.create(body);
  }

  @Put()
  @UseGuards(RoleGuard)
  @Roles('admin', 'staff')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Cập nhật thông tin 1 ghế (ADMIN, STAFF)' })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy ghế' })
  updateSeat(@Body() body: UpdateSeatDto) {
    return this.seatsService.update(body);
  }

  @Delete('/:seatId')
  @UseGuards(RoleGuard)
  @Roles('admin', 'staff')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Xóa 1 ghế (ADMIN, STAFF)' })
  @ApiResponse({ status: 200, description: 'Xóa ghế thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy ghế' })
  deleteSeat(@Param('seatId') seatId: string) {
    return this.seatsService.delete(seatId);
  }
}
