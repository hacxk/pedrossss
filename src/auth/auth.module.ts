import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UserService } from "src/shared/service/user.service";
import { PrismaService } from "src/shared/service/prisma.service";

@Module({
    imports: [
        ConfigModule.forRoot(),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: {
                    expiresIn: '1d',
                },
            }),
        }),
    ],
    providers: [AuthService, UserService, PrismaService],
    controllers: [AuthController],
})
export class AuthModule { }
