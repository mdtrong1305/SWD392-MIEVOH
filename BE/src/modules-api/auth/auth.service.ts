import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { ClientProxy } from '@nestjs/microservices';
import {
  LoginAuthDto,
  RegisterAuthDto,
  VerifyRegisterOtpDto,
  VerifyEmailDto,
  VerifyResetOtpDto,
  ResetPasswordDto,
  ChangePasswordDto,
} from './dto/auth.dto';
import * as crypto from 'crypto';
import { PrismaService } from '../../modules-system/prisma/prisma.service';
import { TokenService } from '../../modules-system/token/token.service';
import * as bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';
import { GOOGLE_CLIENT_ID } from '../../common/constant/app.constant';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @Inject('EMAIL_SERVICE') private readonly emailClient: ClientProxy,
  ) {}

  async login(createAuthDto: LoginAuthDto) {
    // 1. Kiểm tra user tồn tại qua email
    const user = await this.prisma.user.findFirst({
      where: { email: createAuthDto.email, authProvider: 'local' },
    });

    if (!user) {
      throw new UnauthorizedException('Tài khoản không tồn tại');
    }

    // 2. So sánh mật khẩu
    const isPasswordValid = bcrypt.compareSync(
      createAuthDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Sai mật khẩu');
    }

    // 3. Tạo Token
    const token = await this.tokenService.createTokens(user);

    // 4. Trả về thông tin user và token
    return {
      user: {
        email: user.email,
        fullName: user.fullName,
        avatar: user.avatar,
        userType: user.userType,
        cinemaComplexId: user.cinemaComplexId,
      },
      token,
    };
  }

  async requestRegisterOtp(registerDto: RegisterAuthDto) {
    // kiểm tra user tồn tại qua email hoặc số điện thoại (Bất kể Local hay Google)
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: registerDto.email },
          { phoneNumber: registerDto.phoneNumber },
        ],
      },
    });

    if (user) {
      if (user.authProvider === 'google') {
        throw new BadRequestException('Email này đã được đăng nhập qua Google. Vui lòng sử dụng Đăng nhập bằng Google.');
      }
      throw new BadRequestException('Email hoặc Số điện thoại đã được đăng ký');
    }

    const cooldown = await this.cacheManager.get(`REGISTER_OTP_COOLDOWN:${registerDto.email}`);
    if (cooldown) {
      throw new BadRequestException('Vui lòng đợi 1 phút trước khi yêu cầu gửi lại mã OTP mới');
    }

    // tạo mã OTP (6 số)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // hash mật khẩu và chuẩn bị data lưu vào Redis
    const tempData = {
      email: registerDto.email,
      fullName: registerDto.fullName,
      phoneNumber: registerDto.phoneNumber,
      password: bcrypt.hashSync(registerDto.password, 10),
      otp,
    };

    // lưu vào Redis, thời gian sống (TTL) là 5 phút (300,000ms vì cache-manager v5 dùng ms)
    await this.cacheManager.set(
      `REGISTER_OTP:${registerDto.email}`,
      tempData,
      300000,
    );
    
    // Cài đặt cooldown 1 phút (60,000ms)
    await this.cacheManager.set(`REGISTER_OTP_COOLDOWN:${registerDto.email}`, '1', 60000);

    // gửi Email chứa OTP (Gửi qua RabbitMQ)
    this.emailClient.emit('send_email', {
      to: registerDto.email,
      subject: 'Mã xác thực đăng ký tài khoản Mievoh',
      html: `
        <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #110826; color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #2e1a5a;">
          <div style="background: linear-gradient(135deg, #8b5cf6, #4c1d95); padding: 40px 20px; text-align: center;">
            <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 800; letter-spacing: 1px; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">MIEVOH CINEMA</h1>
            <p style="margin: 10px 0 0; color: rgba(255,255,255,0.9); font-size: 16px; font-weight: 500;">Xác Thực Tài Khoản Đăng Ký</p>
          </div>
          <div style="padding: 40px 30px;">
            <p style="font-size: 16px; line-height: 1.6; color: #e4e4e7; margin-top: 0;">Chào ${registerDto.fullName},</p>
            <p style="font-size: 16px; line-height: 1.6; color: #a1a1aa;">Bạn vừa yêu cầu lấy mã OTP để đăng ký tài khoản. Vui lòng sử dụng mã bảo mật dưới đây để hoàn tất quá trình:</p>
            <div style="margin: 30px 0; text-align: center;">
              <div style="display: inline-block; background-color: #1a0f35; color: #8b5cf6; padding: 15px 30px; border-radius: 12px; font-size: 32px; font-weight: 800; letter-spacing: 4px; border: 1px solid #2e1a5a;">${otp}</div>
            </div>
            <p style="font-size: 14px; line-height: 1.6; color: #a1a1aa; text-align: center;">Mã này sẽ hết hạn sau <strong>5 phút</strong>. Vui lòng không chia sẻ mã này với bất kỳ ai để đảm bảo an toàn.</p>
            <div style="text-align: center; margin-top: 40px; border-top: 1px solid #2e1a5a; padding-top: 30px;">
              <p style="color: #a1a1aa; font-size: 14px; margin: 0;">Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email.</p>
              <h2 style="color: #8b5cf6; margin: 15px 0 0; font-size: 20px; font-weight: 700;">Đội ngũ MIEVOH</h2>
            </div>
          </div>
        </div>
      `,
    });

    return { message: 'Mã OTP đã được gửi đến email của bạn', expiresIn: 300 };
  }

  async verifyRegisterOtp(dto: VerifyRegisterOtpDto) {
    // lấy dữ liệu tạm từ Redis
    const tempData: any = await this.cacheManager.get(
      `REGISTER_OTP:${dto.email}`,
    );

    if (!tempData) {
      throw new BadRequestException('Mã OTP đã hết hạn hoặc không tồn tại');
    }

    // kiểm tra OTP
    if (tempData.otp !== dto.otp) {
      throw new BadRequestException('Mã OTP không chính xác');
    }

    // OTP đúng -> Xóa key trong Redis
    await this.cacheManager.del(`REGISTER_OTP:${dto.email}`);

    // lưu User vào MongoDB
    const newUser = await this.prisma.user.create({
      data: {
        email: tempData.email,
        fullName: tempData.fullName,
        phoneNumber: tempData.phoneNumber,
        password: tempData.password,
        authProvider: 'local',
        userType: 'user',
      },
    });

    // tạo Token
    const token = await this.tokenService.createTokens(newUser);

    // trả về thông tin user và token
    return {
      user: {
        email: newUser.email,
        fullName: newUser.fullName,
        avatar: newUser.avatar,
        userType: newUser.userType,
        cinemaComplexId: newUser.cinemaComplexId,
      },
      token,
    };
  }

  async googleLogin(req: any) {
    if (!req.user) {
      throw new UnauthorizedException('Không tìm thấy thông tin từ Google');
    }

    const { googleId, email, fullName, avatar } = req.user;

    // 1. Kiểm tra user đã tồn tại chưa
    let user = await this.prisma.user.findFirst({
      where: {
        OR: [{ googleId }, { email }],
      },
    });

    // 2. Nếu chưa, tạo user mới
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email,
          fullName,
          avatar,
          googleId,
          authProvider: 'google',
          userType: 'user',
        },
      });
    } else if (!user.googleId) {
      // 2.1 Nếu user đã tồn tại (Local) nhưng chưa link Google -> Link ngay
      user = await this.prisma.user.update({
        where: { email: user.email },
        data: { googleId },
      });
    }

    // 3. Tạo Token
    const token = await this.tokenService.createTokens(user);

    // 4. Trả về thông tin
    return {
      user: {
        email: user.email,
        fullName: user.fullName,
        avatar: user.avatar,
        userType: user.userType,
        cinemaComplexId: user.cinemaComplexId,
      },
      token,
    };
  }

  async googleLoginMobile(idToken: string) {
    if (!idToken) {
      throw new BadRequestException('Vui lòng cung cấp idToken từ Google');
    }

    try {
      const client = new OAuth2Client(GOOGLE_CLIENT_ID);

      const ticket = await client.verifyIdToken({
        idToken,
        audience: GOOGLE_CLIENT_ID, // Chỉ chấp nhận token sinh ra cho app của mình
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new UnauthorizedException('Token Google không hợp lệ');
      }

      const { sub: googleId, email, name: fullName, picture: avatar } = payload;

      let user = await this.prisma.user.findFirst({
        where: {
          OR: [{ googleId }, { email: email! }],
        },
      });

      if (!user) {
        user = await this.prisma.user.create({
          data: {
            email: email!,
            fullName: fullName || 'Google User',
            avatar: avatar || null,
            googleId,
            authProvider: 'google',
            userType: 'user',
          },
        });
      } else if (!user.googleId) {
        // Nếu user đã tồn tại (do đăng ký local trước đó) nhưng chưa có googleId -> Link account
        user = await this.prisma.user.update({
          where: { email: user.email },
          data: { googleId },
        });
      }

      const token = await this.tokenService.createTokens(user);

      return {
        user: {
          email: user.email,
          fullName: user.fullName,
          avatar: user.avatar,
          userType: user.userType,
          cinemaComplexId: user.cinemaComplexId,
        },
        token,
      };
    } catch (error) {
      console.error('Google Mobile Login Error:', error);
      throw new UnauthorizedException('Xác thực Google thất bại');
    }
  }

  async verifyEmail(dto: VerifyEmailDto) {
    const user = await this.prisma.user.findFirst({
      where: { email: dto.email, authProvider: 'local' },
    });

    if (!user) {
      throw new NotFoundException('Email này chưa được đăng ký tài khoản');
    }

    const cooldown = await this.cacheManager.get(`RESET_PASSWORD_OTP_COOLDOWN:${dto.email}`);
    if (cooldown) {
      throw new BadRequestException('Vui lòng đợi 1 phút trước khi yêu cầu gửi lại mã OTP mới');
    }

    // tạo mã OTP (6 số)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // lưu vào Redis, thời gian sống (TTL) là 5 phút (300,000ms)
    await this.cacheManager.set(`RESET_PASSWORD_OTP:${dto.email}`, otp, 300000);
    
    // Cài đặt cooldown 1 phút (60,000ms)
    await this.cacheManager.set(`RESET_PASSWORD_OTP_COOLDOWN:${dto.email}`, '1', 60000);

    // gửi Email chứa OTP (Gửi qua RabbitMQ)
    this.emailClient.emit('send_email', {
      to: dto.email,
      subject: 'Mã xác thực khôi phục mật khẩu Mievoh',
      html: `
        <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #110826; color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #2e1a5a;">
          <div style="background: linear-gradient(135deg, #8b5cf6, #4c1d95); padding: 40px 20px; text-align: center;">
            <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 800; letter-spacing: 1px; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">MIEVOH CINEMA</h1>
            <p style="margin: 10px 0 0; color: rgba(255,255,255,0.9); font-size: 16px; font-weight: 500;">Yêu Cầu Khôi Phục Mật Khẩu</p>
          </div>
          <div style="padding: 40px 30px;">
            <p style="font-size: 16px; line-height: 1.6; color: #e4e4e7; margin-top: 0;">Chào ${user.fullName},</p>
            <p style="font-size: 16px; line-height: 1.6; color: #a1a1aa;">Bạn vừa yêu cầu lấy mã OTP để khôi phục mật khẩu. Vui lòng sử dụng mã bảo mật dưới đây để đổi mật khẩu mới:</p>
            <div style="margin: 30px 0; text-align: center;">
              <div style="display: inline-block; background-color: #1a0f35; color: #8b5cf6; padding: 15px 30px; border-radius: 12px; font-size: 32px; font-weight: 800; letter-spacing: 4px; border: 1px solid #2e1a5a;">${otp}</div>
            </div>
            <p style="font-size: 14px; line-height: 1.6; color: #a1a1aa; text-align: center;">Mã này sẽ hết hạn sau <strong>5 phút</strong>. Vui lòng không chia sẻ mã này với bất kỳ ai để đảm bảo an toàn.</p>
            <div style="text-align: center; margin-top: 40px; border-top: 1px solid #2e1a5a; padding-top: 30px;">
              <p style="color: #a1a1aa; font-size: 14px; margin: 0;">Nếu bạn không yêu cầu đổi mật khẩu, có thể ai đó đang cố truy cập tài khoản của bạn. Vui lòng bỏ qua email này.</p>
              <h2 style="color: #8b5cf6; margin: 15px 0 0; font-size: 20px; font-weight: 700;">Đội ngũ MIEVOH</h2>
            </div>
          </div>
        </div>
      `,
    });

    return { message: 'Mã OTP khôi phục mật khẩu đã được gửi đến email của bạn', expiresIn: 300 };
  }

  async verifyResetOtp(dto: VerifyResetOtpDto) {
    const savedOtp = await this.cacheManager.get(`RESET_PASSWORD_OTP:${dto.email}`);

    if (!savedOtp) {
      throw new BadRequestException('Mã OTP đã hết hạn hoặc không tồn tại');
    }

    if (savedOtp !== dto.otp) {
      throw new BadRequestException('Mã OTP không chính xác');
    }

    // OTP hợp lệ -> Xóa mã OTP
    await this.cacheManager.del(`RESET_PASSWORD_OTP:${dto.email}`);

    // Sinh Reset Token ngẫu nhiên (dùng 1 lần, sống trong 15 phút)
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Lưu vào Redis, cấu trúc: { email: '...' }
    await this.cacheManager.set(`RESET_TOKEN:${resetToken}`, { email: dto.email }, 900000);

    return { resetToken, expiresIn: 900 };
  }

  async resetPassword(dto: ResetPasswordDto) {
    // Lấy thông tin từ Reset Token
    const tokenData: any = await this.cacheManager.get(`RESET_TOKEN:${dto.resetToken}`);

    if (!tokenData || !tokenData.email) {
      throw new BadRequestException('Phiên khôi phục mật khẩu đã hết hạn hoặc không hợp lệ');
    }

    const email = tokenData.email;

    const user = await this.prisma.user.findFirst({
      where: { email, authProvider: 'local' },
    });

    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    // Cập nhật mật khẩu mới
    await this.prisma.user.update({
      where: { email },
      data: {
        password: bcrypt.hashSync(dto.newPassword, 10),
      },
    });

    // Xóa Reset Token để tránh dùng lại
    await this.cacheManager.del(`RESET_TOKEN:${dto.resetToken}`);

    return { message: 'Khôi phục mật khẩu thành công' };
  }

  async changePassword(email: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    if (user.authProvider !== 'local') {
      throw new BadRequestException(
        'Tài khoản được đăng nhập bằng bên thứ ba, không thể đổi mật khẩu',
      );
    }

    const isPasswordValid = bcrypt.compareSync(
      dto.oldPassword,
      user.password || '',
    );
    if (!isPasswordValid) {
      throw new BadRequestException('Mật khẩu cũ không chính xác');
    }

    await this.prisma.user.update({
      where: { email },
      data: {
        password: bcrypt.hashSync(dto.newPassword, 10),
      },
    });

    return { message: 'Đổi mật khẩu thành công' };
  }
}
