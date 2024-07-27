import { Module } from "@nestjs/common";
import { FacebookController } from "./facebook.controller";
import { FacebookService } from "./facebook.service";
import { PassportModule } from "@nestjs/passport";
import { ConfigService, ConfigModule } from "@nestjs/config";
import { FacebookStrategy } from "./strategy/facebook.strategy";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/shared/prisma/prisma.service";

@Module({
    imports: [PassportModule, ConfigModule],
    controllers: [FacebookController],
    providers: [
        FacebookStrategy,
        FacebookService,
        ConfigService,
        JwtService,
        PrismaService,
        {
            provide: 'FACEBOOK_CONFIG',
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                clientID: configService.get<string>('FACEBOOK_APP_ID'), 
                clientSecret: configService.get<string>('FACEBOOK_APP_SECRET'), 
                callbackURL: 'http://localhost:3000/auth/facebook/redirect', 
                scope: ['email', 'public_profile'],
            }),
        },
        {
            provide: 'AUTH_SERVICE',
            useClass: FacebookService,
        },
    ]
})
export class FacebookModule { }
