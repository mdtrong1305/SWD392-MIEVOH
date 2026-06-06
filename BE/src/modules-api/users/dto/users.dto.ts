import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  Matches,
} from 'class-validator';

export class CreateStaffDto {
  @ApiProperty({ description: 'Tên đăng nhập', example: 'staff_cgv' })
  @IsNotEmpty({ message: 'Vui lòng nhập tên đăng nhập' })
  @IsString()
  username: string;

  @ApiProperty({ description: 'Họ và tên', example: 'Nguyễn Văn A' })
  @IsNotEmpty({ message: 'Vui lòng nhập họ tên' })
  @IsString()
  fullName: string;

  @ApiProperty({ description: 'Email liên hệ', example: 'staff@cgv.vn' })
  @IsNotEmpty({ message: 'Vui lòng nhập email' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @ApiProperty({
    description: 'Mật khẩu khởi tạo (tuỳ chọn, mặc định: 123456)',
    example: '123456',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'Mật khẩu phải từ 6 ký tự trở lên' })
  password?: string;

  @ApiProperty({
    description: 'ID của cụm rạp quản lý',
    example: '64b1c2...',
  })
  @IsNotEmpty({ message: 'Vui lòng chọn cụm rạp' })
  @IsString()
  cinemaComplexId: string;
}

export class UpdateStaffDto {
  @ApiPropertyOptional({ description: 'Họ và tên', example: 'Nguyễn Văn B' })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiPropertyOptional({ description: 'Email liên hệ', example: 'staff2@cgv.vn' })
  @IsOptional()
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email?: string;

  @ApiPropertyOptional({
    description: 'ID của cụm rạp quản lý mới',
    example: '64b1c2...',
  })
  @IsOptional()
  @IsString()
  cinemaComplexId?: string;

  @ApiPropertyOptional({
    description: 'Trạng thái hoạt động',
    example: true,
  })
  @IsOptional()
  isActive?: boolean;
}
