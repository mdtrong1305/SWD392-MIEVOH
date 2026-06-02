import { Module } from '@nestjs/common';
import { PrismaModule } from './modules-system/prisma/prisma.module';
import { TokenModule } from './modules-system/token/token.module';
import { AuthModule } from './modules-api/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './common/guards/protect.guard';
import { RoleGuard } from './common/guards/role.guard';

@Module({
  imports: [PrismaModule, TokenModule, AuthModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    RoleGuard,
  ],
})
export class AppModule {}
