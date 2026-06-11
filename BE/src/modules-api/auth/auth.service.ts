import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import {
  LoginAuthDto,
  RegisterAuthDto,
  VerifyEmailDto,
  ResetPasswordDto,
  ChangePasswordDto,
} from './dto/auth.dto';
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

  async register(registerDto: RegisterAuthDto) {
    // 1. Kiểm tra user tồn tại qua email hoặc số điện thoại
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: registerDto.email },
          { phoneNumber: registerDto.phoneNumber },
        ],
        authProvider: 'local',
      },
    });

    if (user) {
      throw new UnauthorizedException('Tài khoản đã tồn tại');
    }

    // 2. Tạo user
    const newUser = await this.prisma.user.create({
      data: {
        email: registerDto.email,
        fullName: registerDto.fullName,
        phoneNumber: registerDto.phoneNumber,
        password: bcrypt.hashSync(registerDto.password, 10),
        authProvider: 'local',
        userType: 'user',
      },
    });

    // 3. Tạo Token
    const token = await this.tokenService.createTokens(newUser);

    // 4. Trả về thông tin user và token
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

    return { message: 'Xác thực email thành công' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.prisma.user.findFirst({
      where: { email: dto.email, authProvider: 'local' },
    });

    if (!user) {
      throw new NotFoundException('Email này chưa được đăng ký tài khoản');
    }

    await this.prisma.user.update({
      where: { email: user.email },
      data: {
        password: bcrypt.hashSync(dto.newPassword, 10),
      },
    });

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
