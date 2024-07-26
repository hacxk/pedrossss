import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './shared/service/prisma.service';
import { FacebookModule } from './facebook/facebook.module';

@Module({
  imports: [SharedModule, AuthModule, FacebookModule],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService
  ],
})
export class AppModule {}
