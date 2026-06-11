import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  LoginAuthDto,
  RegisterAuthDto,
  VerifyEmailDto,
  ResetPasswordDto,
  ChangePasswordDto,
} from './dto/auth.dto';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import { Public } from '../../common/decorators/public.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiExcludeEndpoint,
} from '@nestjs/swagger';
import { FRONTEND_URL } from '../../common/constant/app.constant';

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
  @ApiExcludeEndpoint()
  @ApiOperation({ summary: 'Callback nhận dữ liệu từ Google trả về' })
  @ApiResponse({
    status: 302,
    description:
      'Xác thực Google thành công, chuyển hướng về Frontend với Token.',
  })
  async googleAuthRedirect(@Req() req: Request, @Res() res: any) {
    const result = await this.authService.googleLogin(req);
    const token = result.token.accessToken;
    const user = result.user;

    const frontendUrl = FRONTEND_URL || 'http://localhost:5173';
    const redirectUrl = `${frontendUrl}/login#token=${token}&email=${user.email}&fullName=${encodeURIComponent(user.fullName || '')}&avatar=${user.avatar || ''}`;

    return res.redirect(redirectUrl);
  }

  @Public()
  @Post('google/mobile')
  @ApiOperation({
    summary: 'Đăng nhập Google bằng idToken dành cho Mobile App',
  })
  @ApiResponse({
    status: 200,
    description: 'Xác thực thành công, trả về JWT và thông tin user.',
  })
  @ApiResponse({
    status: 401,
    description: 'Token Google không hợp lệ hoặc đã hết hạn.',
  })
  async googleLoginMobile(@Body('idToken') idToken: string) {
    return this.authService.googleLoginMobile(idToken);
  }

  @Public()
  @Post('verify-email')
  @ApiOperation({ summary: 'Kiểm tra email tồn tại để khôi phục mật khẩu' })
  @ApiResponse({ status: 200, description: 'Email tồn tại và hợp lệ.' })
  @ApiResponse({ status: 404, description: 'Email chưa đăng ký.' })
  verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return this.authService.verifyEmail(verifyEmailDto);
  }

  @Public()
  @Post('reset-password')
  @ApiOperation({ summary: 'Đặt lại mật khẩu mới cho người dùng' })
  @ApiResponse({ status: 200, description: 'Đặt lại mật khẩu thành công.' })
  @ApiResponse({ status: 404, description: 'Email chưa đăng ký.' })
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @ApiBearerAuth('JWT-auth')
  @Post('change-password')
  @ApiOperation({ summary: 'Thay đổi mật khẩu khi đang đăng nhập' })
  @ApiResponse({ status: 200, description: 'Đổi mật khẩu thành công.' })
  @ApiResponse({
    status: 400,
    description: 'Mật khẩu cũ không chính xác hoặc tài khoản là OAuth.',
  })
  changePassword(
    @Req() req: Request,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    const email = (req as any).user.email;
    return this.authService.changePassword(email, changePasswordDto);
  }
}
