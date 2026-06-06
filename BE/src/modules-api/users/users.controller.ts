import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../../common/decorators/user.decorator';
import type { User as PrismaUser } from '../../modules-system/prisma/generated/prisma/client';
import { CreateStaffDto, UpdateStaffDto } from './dto/users.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { RoleGuard } from '../../common/guards/role.guard';
import { Roles } from '../../common/decorators/role.decorator';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @UseGuards(RoleGuard)
  @Roles('admin', 'staff', 'user') // Hoặc bỏ Roles nếu chỉ cần JwtAuthGuard, nhưng cứ để cho đồng nhất
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Lấy thông tin cá nhân (Profile)' })
  @ApiResponse({ status: 200, description: 'Lấy thông tin thành công' })
  getProfile(@User() user: PrismaUser) {
    return this.usersService.getProfile(user.username);
  }

  @Get()
  @UseGuards(RoleGuard)
  @Roles('admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Lấy danh sách người dùng (ADMIN)' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Số trang (Mặc định: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Số lượng / trang (Mặc định: 10)' })
  @ApiQuery({ name: 'userType', required: false, type: String, description: 'Loại tài khoản (user, staff, admin)' })
  @ApiResponse({ status: 200, description: 'Lấy danh sách thành công' })
  getAllUsers(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('userType') userType?: string,
  ) {
    return this.usersService.getAllUsers(page, limit, userType);
  }

  @Get(':username')
  @UseGuards(RoleGuard)
  @Roles('admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Lấy chi tiết 1 người dùng (ADMIN)' })
  @ApiResponse({ status: 200, description: 'Thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy tài khoản' })
  getUserById(@Param('username') username: string) {
    return this.usersService.getUserById(username);
  }

  @Post('staff')
  @UseGuards(RoleGuard)
  @Roles('admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Tạo tài khoản nhân viên - Staff (ADMIN)' })
  @ApiResponse({ status: 201, description: 'Tạo tài khoản thành công' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ApiResponse({ status: 409, description: 'Tài khoản hoặc email đã tồn tại' })
  createStaff(@Body() createStaffDto: CreateStaffDto) {
    return this.usersService.createStaff(createStaffDto);
  }

  @Put('staff/:username')
  @UseGuards(RoleGuard)
  @Roles('admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Cập nhật tài khoản hoặc luân chuyển Cụm rạp cho Staff (ADMIN)' })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy tài khoản hoặc cụm rạp' })
  updateStaff(
    @Param('username') username: string,
    @Body() updateStaffDto: UpdateStaffDto,
  ) {
    return this.usersService.updateStaff(username, updateStaffDto);
  }

  @Delete(':username')
  @UseGuards(RoleGuard)
  @Roles('admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Vô hiệu hóa tài khoản (ADMIN)' })
  @ApiResponse({ status: 200, description: 'Vô hiệu hóa thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy tài khoản' })
  deleteUser(@Param('username') username: string) {
    return this.usersService.deleteUser(username);
  }
}
