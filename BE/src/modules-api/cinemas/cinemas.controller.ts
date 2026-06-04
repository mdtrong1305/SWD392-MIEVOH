import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
  Query,
} from '@nestjs/common';
import { CinemasService } from './cinemas.service';
import { Roles } from '../../common/decorators/role.decorator';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateCinemaDto, UpdateCinemaDto } from './dto/cinemas.dto';
import { RoleGuard } from '../../common/guards/role.guard';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Cinemas')
@ApiExtraModels(CreateCinemaDto, UpdateCinemaDto)
@Controller('cinemas')
export class CinemasController {
  constructor(private readonly cinemasService: CinemasService) {}

  @Post()
  @UseGuards(RoleGuard)
  @Roles('admin', 'staff')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Tạo rạp chiếu mới (ADMIN, STAFF)' })
  @ApiResponse({ status: 201, description: 'Tạo rạp chiếu thành công' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy cụm rạp' })
  createCinema(@Body() body: CreateCinemaDto) {
    return this.cinemasService.create(body);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Lấy danh sách rạp chiếu (có thể lọc theo cụm rạp)' })
  @ApiQuery({ name: 'cinemaComplexId', required: false, description: 'Mã cụm rạp để lọc' })
  @ApiResponse({ status: 200, description: 'Lấy danh sách thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy cụm rạp' })
  getCinemas(@Query('cinemaComplexId') cinemaComplexId?: string) {
    if (cinemaComplexId) {
      return this.cinemasService.getCinemasByComplexId(cinemaComplexId);
    }
    return this.cinemasService.findAll();
  }

  @Get('/:cinemaId')
  @Public()
  @ApiOperation({ summary: 'Lấy chi tiết rạp chiếu' })
  @ApiResponse({ status: 200, description: 'Lấy chi tiết thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy rạp chiếu' })
  findById(@Param('cinemaId') cinemaId: string) {
    return this.cinemasService.findById(cinemaId);
  }

  @Put()
  @UseGuards(RoleGuard)
  @Roles('admin', 'staff')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Cập nhật rạp chiếu (ADMIN, STAFF)' })
  @ApiResponse({ status: 200, description: 'Cập nhật rạp chiếu thành công' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền' })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy rạp chiếu hoặc cụm rạp',
  })
  updateCinema(@Body() body: UpdateCinemaDto) {
    return this.cinemasService.update(body);
  }

  @Delete('/:cinemaId')
  @UseGuards(RoleGuard)
  @Roles('admin', 'staff')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Xóa rạp chiếu (ADMIN, STAFF)' })
  @ApiResponse({ status: 200, description: 'Xóa rạp chiếu thành công' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy rạp chiếu' })
  deleteCinema(@Param('cinemaId') cinemaId: string) {
    return this.cinemasService.delete(cinemaId);
  }
}
