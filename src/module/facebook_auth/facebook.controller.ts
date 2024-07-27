import { Controller, Get, UseGuards, Req } from "@nestjs/common";
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { FacebookService } from "./facebook.service";
import { JwtAuthGuard } from "src/helpers/guard/jwtauth.guard";

interface AuthenticatedRequest extends Request {
    user: any;
}

@Controller('auth')
export class FacebookController {
    constructor(private facebookService: FacebookService) { }

    @Get('facebook')
    @UseGuards(JwtAuthGuard)
    @UseGuards(AuthGuard('facebook'))
    async facebookLogin(): Promise<any> {
        // The AuthGuard will redirect to Facebook Pedro u Understande don't blame me this is empty bla bla bla u need to study more bla bla bla lol~
    }

    @Get('facebook/redirect')
    @UseGuards(AuthGuard('facebook'))
    async facebookLoginRedirect(@Req() req: AuthenticatedRequest): Promise<any> {
        const user = req.user; 
        return { msg: 'Facebook login successful', user };
    }
}
