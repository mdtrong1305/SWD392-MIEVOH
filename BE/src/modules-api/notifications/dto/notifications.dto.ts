import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class BroadcastNotificationDto {
  @ApiProperty({ example: 'Cập nhật hệ thống' })
  @IsNotEmpty({ message: 'Tiêu đề không được để trống' })
  @IsString()
  title!: string;

  @ApiProperty({ example: 'Hệ thống sẽ bảo trì vào 12h đêm nay' })
  @IsNotEmpty({ message: 'Nội dung không được để trống' })
  @IsString()
  message!: string;

  @ApiProperty({ example: '/maintenance', required: false })
  @IsOptional()
  @IsString()
  link?: string;
}

export class UpdateNotificationDto {
  @ApiProperty({ example: 'Cập nhật hệ thống', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ example: 'Hệ thống sẽ bảo trì vào 12h đêm nay', required: false })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiProperty({ example: '/maintenance', required: false })
  @IsOptional()
  @IsString()
  link?: string;
}

export class CreateNotificationAdminDto {
  @ApiProperty({ example: 'johndoe' })
  @IsNotEmpty({ message: 'Username không được để trống' })
  @IsString()
  username!: string;

  @ApiProperty({ example: 'Bạn nhận được 1 Voucher mới!' })
  @IsNotEmpty({ message: 'Tiêu đề không được để trống' })
  @IsString()
  title!: string;

  @ApiProperty({ example: 'Giảm giá 50% cho phim hành động' })
  @IsNotEmpty({ message: 'Nội dung không được để trống' })
  @IsString()
  message!: string;

  @ApiProperty({ example: '/vouchers', required: false })
  @IsOptional()
  @IsString()
  link?: string;
}
