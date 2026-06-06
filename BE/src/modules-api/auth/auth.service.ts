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

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
  ) {}

  async login(createAuthDto: LoginAuthDto) {
    // 1. Kiểm tra user tồn tại qua email hoặc số điện thoại
    const user = await this.prisma.user.findFirst({
      where: { username: createAuthDto.username, authProvider: 'local' },
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
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        avatar: user.avatar,
        userType: user.userType,
        cinemaComplexId: user.cinemaComplexId,
      },
      token,
    };
  }

  async register(registerDto: RegisterAuthDto) {
    // 1. Kiểm tra user tồn tại qua email hoặc số điện thoại hoặc username
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: registerDto.email },
          { phoneNumber: registerDto.phoneNumber },
          { username: registerDto.username },
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
        username: registerDto.username,
        fullName: registerDto.fullName,
        email: registerDto.email,
        phoneNumber: registerDto.phoneNumber,
        password: bcrypt.hashSync(registerDto.password, 10),
        authProvider: 'local',
        userType: 'USER',
      },
    });

    // 3. Tạo Token
    const token = await this.tokenService.createTokens(newUser);

    // 4. Trả về thông tin user và token
    return {
      user: {
        username: newUser.username,
        fullName: newUser.fullName,
        email: newUser.email,
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
          username: email, // Dùng email làm username
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
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        avatar: user.avatar,
        userType: user.userType,
        cinemaComplexId: user.cinemaComplexId,
      },
      token,
    };
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
      where: { username: user.username },
      data: {
        password: bcrypt.hashSync(dto.newPassword, 10),
      },
    });

    return { message: 'Khôi phục mật khẩu thành công' };
  }

  async changePassword(username: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { username },
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
      where: { username },
      data: {
        password: bcrypt.hashSync(dto.newPassword, 10),
      },
    });

    return { message: 'Đổi mật khẩu thành công' };
  }
}
