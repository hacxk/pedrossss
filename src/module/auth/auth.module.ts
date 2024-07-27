import { Module } from "@nestjs/common";
import { PrismaService } from "src/shared/prisma/prisma.service";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtAuthGuard } from "src/helpers/guard/jwtauth.guard";

@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: { expiresIn: '1d' }
            })
        }),
    ],
    providers: [PrismaService, AuthService, JwtAuthGuard],
    controllers: [AuthController]
})

export class AuthModule { }