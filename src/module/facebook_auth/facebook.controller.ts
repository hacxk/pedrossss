import { Controller, Get, UseGuards, Query } from "@nestjs/common";
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from "src/helpers/guard/jwtauth.guard";
import { PrismaService } from "src/shared/prisma/prisma.service";

@Controller('auth')
export class FacebookController {
    constructor(
        private prisma: PrismaService
    ) { }

    @Get('facebook')
    @UseGuards(JwtAuthGuard)
    @UseGuards(AuthGuard('facebook'))
    async facebookLogin(): Promise<any> {
        // The AuthGuard will redirect to Facebook Pedro u Understand don't blame me this is empty bla bla bla u need to study more bla bla bla lol~
    }

    @Get('facebook/redirect')
    @UseGuards(AuthGuard('facebook'))
    async facebookLoginRedirect(): Promise<any> {
        return { msg: 'Facebook login successful' };
    }

    @Get('test')
    async test() {
        const allFacebookInfo = await this.prisma.facebookInfo.findMany({
            include: {
                facebookInfoSecrets: true,
                User: true,
            },
        });
        return allFacebookInfo;
    }
}
