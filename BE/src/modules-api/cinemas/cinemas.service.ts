import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCinemaDto, UpdateCinemaDto } from './dto/cinemas.dto';
import { PrismaService } from '../../modules-system/prisma/prisma.service';

@Injectable()
export class CinemasService {
  constructor(private readonly prisma: PrismaService) {}

  async create(body: CreateCinemaDto) {
    // Kiểm tra cụm rạp có tồn tại không
    const cinemaComplex = await this.prisma.cinemaComplex.findUnique({
      where: { cinemaComplexId: body.cinemaComplexId },
    });

    if (!cinemaComplex) {
      throw new NotFoundException('Không tìm thấy cụm rạp');
    }

    // Tạo rạp
    const cinema = await this.prisma.cinema.create({
      data: {
        name: body.name,
        cinemaComplexId: body.cinemaComplexId,
      },
      include: {
        CinemaComplex: {
          select: {
            cinemaComplexId: true,
            name: true,
            CinemaSystem: {
              select: {
                cinemaSystemId: true,
                name: true,
              },
            },
          },
        },
      },
    });
    return cinema;
  }



  async findById(cinemaId: string) {
    const data = await this.prisma.cinema.findUnique({
      where: { cinemaId },
      include: {
        CinemaComplex: {
          select: {
            cinemaComplexId: true,
            name: true,
            CinemaSystem: {
              select: {
                cinemaSystemId: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!data) {
      throw new NotFoundException('Không tìm thấy rạp chiếu');
    }

    return data;
  }

  async getCinemasByComplexId(cinemaComplexId: string) {
    const cinemaComplex = await this.prisma.cinemaComplex.findUnique({
      where: { cinemaComplexId },
    });

    if (!cinemaComplex) {
      throw new NotFoundException('Không tìm thấy cụm rạp');
    }

    const data = await this.prisma.cinema.findMany({
      where: { cinemaComplexId },
      orderBy: { cinemaId: 'asc' },
      include: {
        CinemaComplex: {
          select: {
            cinemaComplexId: true,
            name: true,
            CinemaSystem: {
              select: {
                cinemaSystemId: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return { data, total: data.length };
  }

  async update(body: UpdateCinemaDto) {
    const cinemaId = body.cinemaId;

    const cinema = await this.prisma.cinema.findUnique({
      where: { cinemaId },
    });

    if (!cinema) {
      throw new NotFoundException('Không tìm thấy rạp chiếu');
    }

    if (body.cinemaComplexId) {
      const cinemaComplexId = body.cinemaComplexId;
      const cinemaComplex = await this.prisma.cinemaComplex.findUnique({
        where: { cinemaComplexId },
      });

      if (!cinemaComplex) {
        throw new NotFoundException('Không tìm thấy cụm rạp');
      }
    }

    const dataToUpdate: any = {};
    if (body.name) dataToUpdate.name = body.name;
    if (body.cinemaComplexId)
      dataToUpdate.cinemaComplexId = body.cinemaComplexId;

    const updated = await this.prisma.cinema.update({
      where: { cinemaId },
      data: dataToUpdate,
    });

    return updated;
  }

  async delete(cinemaId: string) {
    const cinema = await this.prisma.cinema.findUnique({
      where: { cinemaId },
    });

    if (!cinema) {
      throw new NotFoundException('Không tìm thấy rạp chiếu');
    }

    await this.prisma.cinema.delete({
      where: { cinemaId },
    });

    return true;
  }
}
