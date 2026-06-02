import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto, RegisterAuthDto } from './dto/auth.dto';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import { Public } from '../../common/decorators/public.decorator';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Đăng nhập vào hệ thống bằng tài khoản Local' })
  @ApiResponse({
    status: 201,
    description: 'Đăng nhập thành công, trả về token.',
  })
  @ApiResponse({ status: 400, description: 'Sai tài khoản hoặc mật khẩu.' })
  login(@Body() loginDto: LoginAuthDto) {
    return this.authService.login(loginDto);
  }

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Đăng ký tài khoản Local mới' })
  @ApiResponse({ status: 201, description: 'Đăng ký thành công.' })
  @ApiResponse({
    status: 400,
    description: 'Tài khoản đã tồn tại hoặc dữ liệu không hợp lệ.',
  })
  register(@Body() registerDto: RegisterAuthDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Khởi tạo đăng nhập bằng Google (Chuyển hướng)' })
  @ApiResponse({
    status: 302,
    description: 'Chuyển hướng người dùng sang trang đăng nhập của Google.',
  })
  async googleAuth(@Req() req: Request) {
    // Passport sẽ tự động chuyển hướng sang Google
  }

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Callback nhận dữ liệu từ Google trả về' })
  @ApiResponse({
    status: 200,
    description: 'Xác thực Google thành công, trả về JWT Token.',
  })
  googleAuthRedirect(@Req() req: Request) {
    return this.authService.googleLogin(req);
  }
}
