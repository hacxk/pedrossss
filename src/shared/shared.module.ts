import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from './config/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate,
      isGlobal: true,
    }),
  ],
  exports: [ConfigModule], // Export ConfigModule so it can be used in other modules
})
export class SharedModule {}
