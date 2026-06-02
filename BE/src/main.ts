import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { PORT } from './common/constant/app.constant';
import { ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { ResponseSuccessInterceptor } from './common/interceptors/responese-success.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
    .addTag('Authentication', 'Xác thực và đăng ký')
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
