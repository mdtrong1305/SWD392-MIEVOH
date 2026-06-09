import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../modules-system/prisma/prisma.service';
import {
  CreateStaffDto,
  UpdateStaffDto,
  UpdateProfileDto,
} from './dto/users.dto';
import * as bcrypt from 'bcrypt';
import { DOMAIN_SERVER } from '../../common/constant/app.constant';
import { deleteFile } from '../../common/helper/delete-file.helper';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllUsers(page: number, limit: number, userType?: string) {
    const skip = (page - 1) * limit;
    const whereCondition: any = {};
    if (userType) {
      whereCondition.userType = userType;
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where: whereCondition,
        skip,
        take: limit,
        select: {
          username: true,
          fullName: true,
          email: true,
          phoneNumber: true,
          avatar: true,
          userType: true,
          cinemaComplexId: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.user.count({ where: whereCondition }),
    ]);

    return {
      data: users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getUserById(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
      select: {
        username: true,
        fullName: true,
        email: true,
        phoneNumber: true,
        avatar: true,
        userType: true,
        cinemaComplexId: true,
        dateOfBirth: true,
        address: true,
        gender: true,
        cccd: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Không tìm thấy tài khoản');
    }

    return user;
  }

  async getProfile(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
      select: {
        username: true,
        fullName: true,
        email: true,
        phoneNumber: true,
        avatar: true,
        userType: true,
        cinemaComplexId: true,
        dateOfBirth: true,
        address: true,
        gender: true,
        cccd: true,
        rewardPoints: true,
        favoriteGenres: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Không tìm thấy tài khoản');
    }

    return user;
  }

  async updateProfile(
    username: string,
    updateProfileDto: UpdateProfileDto,
    filename?: string,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      throw new NotFoundException('Không tìm thấy tài khoản');
    }

    let parsedDateOfBirth: Date | undefined;
    if (updateProfileDto.dateOfBirth) {
      parsedDateOfBirth = new Date(updateProfileDto.dateOfBirth);
    }

    let avatarUrl = user.avatar;
    if (filename) {
      if (user.avatar) {
        deleteFile(user.avatar);
      }
      avatarUrl = `${DOMAIN_SERVER}/users/${filename}`;
    } else if (updateProfileDto.avatar) {
      avatarUrl = updateProfileDto.avatar; // Phục vụ trường hợp gửi URL trực tiếp
    }

    const updatedUser = await this.prisma.user.update({
      where: { username },
      data: {
        ...updateProfileDto,
        ...(parsedDateOfBirth ? { dateOfBirth: parsedDateOfBirth } : {}),
        avatar: avatarUrl,
      },
      select: {
        username: true,
        fullName: true,
        email: true,
        phoneNumber: true,
        avatar: true,
        dateOfBirth: true,
        address: true,
        gender: true,
        cccd: true,
        updatedAt: true,
      },
    });

    return updatedUser;
  }

  async createStaff(createStaffDto: CreateStaffDto) {
    // Kiểm tra username đã tồn tại chưa
    const existingUsername = await this.prisma.user.findUnique({
      where: { username: createStaffDto.username },
    });
    if (existingUsername) {
      throw new ConflictException('Tên đăng nhập đã tồn tại');
    }

    // Kiểm tra email đã tồn tại chưa
    const existingEmail = await this.prisma.user.findUnique({
      where: { email: createStaffDto.email },
    });
    if (existingEmail) {
      throw new ConflictException('Email đã tồn tại');
    }

    // Kiểm tra cinemaComplexId
    const cinemaComplex = await this.prisma.cinemaComplex.findUnique({
      where: { cinemaComplexId: createStaffDto.cinemaComplexId },
    });
    if (!cinemaComplex) {
      throw new NotFoundException('Không tìm thấy cụm rạp');
    }

    // Hash mật khẩu
    const rawPassword = createStaffDto.password || '123456';
    const saltRounds = parseInt(process.env.BCRYPT_SALT || '10', 10);
    const hashedPassword = await bcrypt.hash(rawPassword, saltRounds);

    // Tạo staff
    const staff = await this.prisma.user.create({
      data: {
        username: createStaffDto.username,
        email: createStaffDto.email,
        fullName: createStaffDto.fullName,
        password: hashedPassword,
        cinemaComplexId: createStaffDto.cinemaComplexId,
        userType: 'staff',
        authProvider: 'local',
      },
      select: {
        username: true,
        fullName: true,
        email: true,
        userType: true,
        cinemaComplexId: true,
        isActive: true,
        createdAt: true,
      },
    });

    return staff;
  }

  async updateStaff(username: string, updateStaffDto: UpdateStaffDto) {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      throw new NotFoundException('Không tìm thấy tài khoản');
    }

    if (user.userType !== 'staff' && updateStaffDto.cinemaComplexId) {
      throw new ConflictException(
        'Tài khoản này không phải nhân viên (Staff), không thể đổi cụm rạp',
      );
    }

    // Nếu đổi email, check trùng
    if (updateStaffDto.email && updateStaffDto.email !== user.email) {
      const existingEmail = await this.prisma.user.findUnique({
        where: { email: updateStaffDto.email },
      });
      if (existingEmail) {
        throw new ConflictException('Email đã được sử dụng bởi người khác');
      }
    }

    // Nếu đổi cụm rạp, check tồn tại
    if (updateStaffDto.cinemaComplexId) {
      const cinemaComplex = await this.prisma.cinemaComplex.findUnique({
        where: { cinemaComplexId: updateStaffDto.cinemaComplexId },
      });
      if (!cinemaComplex) {
        throw new NotFoundException('Không tìm thấy cụm rạp');
      }
    }

    const updatedUser = await this.prisma.user.update({
      where: { username },
      data: updateStaffDto,
      select: {
        username: true,
        fullName: true,
        email: true,
        userType: true,
        cinemaComplexId: true,
        isActive: true,
        updatedAt: true,
      },
    });

    return updatedUser;
  }

  async deleteUser(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      throw new NotFoundException('Không tìm thấy tài khoản');
    }

    // Soft delete bằng cách set isActive = false
    await this.prisma.user.update({
      where: { username },
      data: { isActive: false },
    });

    return { message: 'Đã vô hiệu hóa tài khoản thành công' };
  }
}
