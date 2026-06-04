import { Module } from '@nestjs/common';
import { PrismaModule } from './modules-system/prisma/prisma.module';
import { TokenModule } from './modules-system/token/token.module';
import { AuthModule } from './modules-api/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './common/guards/protect.guard';
import { RoleGuard } from './common/guards/role.guard';
import { BannerModule } from './modules-api/banner/banner.module';
import { CinemaSystemsModule } from './modules-api/cinema-systems/cinema-systems.module';
import { CinemaComplexesModule } from './modules-api/cinema-complexes/cinema-complexes.module';
import { CinemasModule } from './modules-api/cinemas/cinemas.module';

@Module({
  imports: [
    PrismaModule,
    TokenModule,
    AuthModule,
    BannerModule,
    CinemaSystemsModule,
    CinemaComplexesModule,
    CinemasModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    RoleGuard,
  ],
})
export class AppModule {}
