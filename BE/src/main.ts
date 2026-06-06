import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { AppModule } from './app.module';
import { PORT } from './common/constant/app.constant';
import { ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { ResponseSuccessInterceptor } from './common/interceptors/responese-success.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // serve thư mục public/images để có thể truy cập ảnh qua link
  app.useStaticAssets(join(process.cwd(), 'public/images'));
  // đặt api global prefix cho toàn bộ route trong ứng dụng
  app.enableCors({
    origin: true,
    credentials: false,
  });
  // đặt api global prefix cho toàn bộ route trong ứng dụng
  app.setGlobalPrefix('api');
  // bật global pipe để tự động validate dữ liệu đầu vào cho toàn bộ ứng dụng
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  // đăng ký global interceptor để log thông tin request toàn bộ ứng dụng
  app.useGlobalInterceptors(new LoggingInterceptor());
  // đăng ký global interceptor để chuẩn hóa response success toàn bộ ứng dụng
  app.useGlobalInterceptors(new ResponseSuccessInterceptor());
  // Cấu hình Swagger
  const config = new DocumentBuilder()
    .setTitle('Mievoh Booking API')
    .setDescription('Tài liệu API cho hệ thống đặt vé xem phim')
    .setVersion('1.0')
    .addServer('https://api.mievoh.io.vn', 'Production Server')
    .addServer('http://localhost:3069', 'Local Environment')
    .addTag('Authentication', 'Xác thực và đăng ký')
    .addTag('Cinema Systems', 'Quản lý hệ thống rạp')
    .addTag('Cinema Complexes', 'Quản lý cụm rạp')
    .addTag('Cinemas', 'Quản lý rạp')
    .addTag('Seats', 'Quản lý ghế ngồi')
    .addTag('Movies', 'Quản lý phim')
    .addTag('Showtimes', 'Quản lý lịch chiếu')
    .addTag('Banners', 'Quản lý banner')
    .addTag('Foods', 'Quản lý đồ ăn')
    .addTag('Bookings', 'Quản lý đặt vé')
    .addTag('Users', 'Quản lý người dùng (Profile & Admin)')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const port = PORT || 3069;
  await app.listen(port, () => {
    console.log(`[SERVER] Server online at: ${port}`);
    console.log(`[SERVER] Swagger API docs: http://localhost:${port}/api-docs`);
  });
}
bootstrap();
