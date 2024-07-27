import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './module/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { FacebookModule } from './module/facebook_auth/facebook.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    FacebookModule],
  controllers: [AppController],
  providers: [
    AppService
  ],
})
export class AppModule { }
