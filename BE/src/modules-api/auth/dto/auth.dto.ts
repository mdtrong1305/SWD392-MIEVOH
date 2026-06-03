import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginAuthDto {
  @ApiProperty({
    description: 'Tên đăng nhập của người dùng',
    example: 'nguyenvana',
  })
  @IsNotEmpty({ message: 'Tên tài khoản không được để trống' })
  @IsString({ message: 'Tên tài khoản phải là chuỗi' })
  username!: string;

  @ApiProperty({
    description: 'Mật khẩu tài khoản',
    example: '12345678',
  })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @IsString({ message: 'Mật khẩu phải là chuỗi' })
  password!: string;
}

export class RegisterAuthDto {
  @ApiProperty({
    description: 'Tên đăng nhập muốn đăng ký',
    example: 'nguyenvana',
  })
  @IsNotEmpty({ message: 'Tên tài khoản không được để trống' })
  @IsString({ message: 'Tên tài khoản phải là chuỗi' })
  username!: string;

  @ApiProperty({
    description: 'Họ và tên đầy đủ',
    example: 'Nguyễn Văn A',
  })
  @IsNotEmpty({ message: 'Họ tên không được để trống' })
  @IsString({ message: 'Họ tên phải là chuỗi' })
  fullName!: string;

  @ApiProperty({
    description: 'Địa chỉ email liên hệ',
    example: 'nguyenvana@gmail.com',
  })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email!: string;

  @ApiProperty({
    description: 'Số điện thoại liên hệ',
    example: '0987654321',
  })
  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  @IsString({ message: 'Số điện thoại phải là chuỗi' })
  phoneNumber!: string;

  @ApiProperty({
    description: 'Mật khẩu đăng nhập',
    example: '12345678',
  })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @IsString({ message: 'Mật khẩu phải là chuỗi' })
  password!: string;
}

export class VerifyEmailDto {
  @ApiProperty({
    description: 'Địa chỉ email cần khôi phục mật khẩu',
    example: 'nguyenvana@gmail.com',
  })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email!: string;
}

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Địa chỉ email cần khôi phục mật khẩu',
    example: 'nguyenvana@gmail.com',
  })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email!: string;

  @ApiProperty({
    description: 'Mật khẩu mới',
    example: 'newpassword123',
  })
  @IsNotEmpty({ message: 'Mật khẩu mới không được để trống' })
  @IsString({ message: 'Mật khẩu mới phải là chuỗi' })
  newPassword!: string;
}

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Mật khẩu hiện tại',
    example: '12345678',
  })
  @IsNotEmpty({ message: 'Mật khẩu hiện tại không được để trống' })
  @IsString({ message: 'Mật khẩu hiện tại phải là chuỗi' })
  oldPassword!: string;

  @ApiProperty({
    description: 'Mật khẩu mới',
    example: 'newpassword123',
  })
  @IsNotEmpty({ message: 'Mật khẩu mới không được để trống' })
  @IsString({ message: 'Mật khẩu mới phải là chuỗi' })
  newPassword!: string;
}

