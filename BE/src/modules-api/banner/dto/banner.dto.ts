import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class BannerDto {
  @ApiProperty({ example: '60d5ecb8b392d700155b3f11', description: 'Mã banner' })
  bannerId!: string;

  @ApiProperty({ example: '60d5ecb8b392d700155b3f12', description: 'Mã phim' })
  movieId!: string;

  @ApiProperty({
    example: 'https://example.com/banner.jpg',
    description: 'Hình ảnh',
  })
  imageUrl!: string;
}

export class UploadBannerImageDto {
  @ApiProperty({ example: '60d5ecb8b392d700155b3f12', description: 'Mã phim' })
  @IsNotEmpty({ message: 'Mã phim không được để trống' })
  @IsString({ message: 'Mã phim phải là chuỗi' })
  movieId!: string;
}
