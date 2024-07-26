// facebook.module.ts
import { Module } from '@nestjs/common';
import { FacebookStrategy } from './facebook.strategy';
import { FacebookController } from './facebook.controller';
import { FacebookService } from './facebook.service';
import { PrismaService } from '../shared/service/prisma.service'; // Assuming you have a PrismaService

@Module({
  controllers: [FacebookController],
  providers: [FacebookStrategy, FacebookService, PrismaService],
})
export class FacebookModule {}