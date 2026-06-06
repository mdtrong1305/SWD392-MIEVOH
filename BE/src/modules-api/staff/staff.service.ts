import {
    Injectable,
    BadRequestException,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../modules-system/prisma/prisma.service';
import { CreateStaffDto, UpdateStaffDto } from './dto/staff.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class StaffService {
    constructor(private readonly prisma: PrismaService) { }

    async create(body: CreateStaffDto) {
        // Kiểm tra username đã tồn tại chưa
        const existing = await this.prisma.user.findUnique({
            where: { username: body.username },
        });
        if (existing) {
            throw new BadRequestException('Username đã tồn tại');
        }

        // Kiểm tra cụm rạp tồn tại
        const complex = await this.prisma.cinemaComplex.findUnique({
            where: { cinemaComplexId: body.managedComplexId },
        });
        if (!complex) {
            throw new NotFoundException('Cụm rạp không tồn tại');
        }

        // Tạo staff
        const staff = await this.prisma.user.create({
            data: {
                username: body.username,
                fullName: body.fullName,
                email: body.email || null,
                phoneNumber: body.phoneNumber || null,
                password: bcrypt.hashSync(body.password, 10),
                authProvider: 'local',
                userType: 'staff',
                managedComplexId: body.managedComplexId,
            },
        });

        const { password, ...result } = staff;
        return result;
    }

    async findAll() {
        const staffList = await this.prisma.user.findMany({
            where: { userType: 'staff' },
            select: {
                username: true,
                fullName: true,
                email: true,
                phoneNumber: true,
                userType: true,
                managedComplexId: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        return staffList;
    }

    async findOne(username: string) {
        const staff = await this.prisma.user.findFirst({
            where: { username, userType: 'staff' },
            select: {
                username: true,
                fullName: true,
                email: true,
                phoneNumber: true,
                userType: true,
                managedComplexId: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        if (!staff) {
            throw new NotFoundException('Không tìm thấy nhân viên');
        }
        return staff;
    }

    async update(username: string, body: UpdateStaffDto) {
        const staff = await this.prisma.user.findFirst({
            where: { username, userType: 'staff' },
        });
        if (!staff) {
            throw new NotFoundException('Không tìm thấy nhân viên');
        }

        // Nếu đổi cụm rạp, kiểm tra cụm rạp mới tồn tại
        if (body.managedComplexId) {
            const complex = await this.prisma.cinemaComplex.findUnique({
                where: { cinemaComplexId: body.managedComplexId },
            });
            if (!complex) {
                throw new NotFoundException('Cụm rạp không tồn tại');
            }
        }

        const updateData: any = {};
        if (body.fullName !== undefined) updateData.fullName = body.fullName;
        if (body.email !== undefined) updateData.email = body.email || null;
        if (body.phoneNumber !== undefined) updateData.phoneNumber = body.phoneNumber || null;
        if (body.managedComplexId !== undefined) updateData.managedComplexId = body.managedComplexId;
        if (body.password) {
            updateData.password = bcrypt.hashSync(body.password, 10);
        }

        const updated = await this.prisma.user.update({
            where: { username },
            data: updateData,
        });

        const { password, ...result } = updated;
        return result;
    }

    async delete(username: string) {
        const staff = await this.prisma.user.findFirst({
            where: { username, userType: 'staff' },
        });
        if (!staff) {
            throw new NotFoundException('Không tìm thấy nhân viên');
        }

        await this.prisma.user.delete({
            where: { username },
        });

        return { message: 'Xóa nhân viên thành công' };
    }
}
