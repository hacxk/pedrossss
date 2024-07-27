import { Body, Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { RegisterDto } from "./dto/register.dto";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { Response } from "express";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    async registerUser(@Body() data: RegisterDto) {
        return this.authService.registerUser(data)
    }

    @Post('login')
    async loginUser(@Body() data: LoginDto, @Res({ passthrough: true }) res: Response) {
        return this.authService.loginUser(data, res)
    }
}