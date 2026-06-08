import { Inject, Module, OnModuleInit } from '@nestjs/common';
import { PrismaModule } from './modules-system/prisma/prisma.module';
import { TokenModule } from './modules-system/token/token.module';
import { AuthModule } from './modules-api/auth/auth.module';
import { SocketModule } from './modules-system/socket/socket.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './common/guards/protect.guard';
import { RoleGuard } from './common/guards/role.guard';
import { BannerModule } from './modules-api/banner/banner.module';
import { CinemaSystemsModule } from './modules-api/cinema-systems/cinema-systems.module';
import { CinemaComplexesModule } from './modules-api/cinema-complexes/cinema-complexes.module';
import { CinemasModule } from './modules-api/cinemas/cinemas.module';
import { SeatsModule } from './modules-api/seats/seats.module';
import { MoviesModule } from './modules-api/movies/movies.module';
import { ShowtimesModule } from './modules-api/showtimes/showtimes.module';
import { FoodsModule } from './modules-api/foods/foods.module';
import { BookingsModule } from './modules-api/bookings/bookings.module';
import { PaymentsModule } from './modules-api/payments/payments.module';
import { Cache, CACHE_MANAGER, CacheModule } from '@nestjs/cache-manager';
import KeyvRedis from '@keyv/redis';
import { DATABASE_REDIS } from './common/constant/app.constant';
import { UsersModule } from './modules-api/users/users.module';
import { BullSystemModule } from './modules-system/bull/bull.module';
import { ReviewsModule } from './modules-api/reviews/reviews.module';
import { RabbitMQModule } from './modules-system/rabbit-mq/rabbit-mq.module';
import { RecommendationsModule } from './modules-api/recommendations/recommendations.module';

@Module({
  imports: [
    RabbitMQModule,
    SocketModule,
    BullSystemModule,
    CacheModule.register({
      // cấu hình cache toàn cục sử dụng Redis
      isGlobal: true, // cho phép sử dụng cache ở mọi module
      stores: [new KeyvRedis(DATABASE_REDIS)], // cấu hình kết nối Redis
    }),
    PrismaModule,
    TokenModule,
    AuthModule,
    BannerModule,
    CinemaSystemsModule,
    CinemaComplexesModule,
    CinemasModule,
    SeatsModule,
    MoviesModule,
    ShowtimesModule,
    FoodsModule,
    BookingsModule,
    PaymentsModule,
    UsersModule,
    ReviewsModule,
    RecommendationsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    RoleGuard,
  ],
})
export class AppModule implements OnModuleInit {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  // check kết nối cache khi khởi tạo module
  async onModuleInit() {
    try {
      await this.cacheManager.get('healthcheck');
      console.log('Redis cache is connected');
    } catch (error) {
      console.error('Redis cache connection error:', error);
    }
  }
}
