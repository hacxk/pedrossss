import { Controller, Post, Body, Res, HttpStatus, UnauthorizedException, ConflictException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(
        @Body() loginDto: LoginDto,
        @Res({ passthrough: true }) res: Response,
    ): Promise<void> {
        try {
            const { accessToken, sessionId } = await this.authService.login(loginDto);
            res.cookie('session_id', sessionId, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', 
                sameSite: 'strict',
            });
            res.setHeader('Authorization', `Bearer ${accessToken}`);
            res.status(HttpStatus.OK).json({ message: 'Log in Success! ✅' });
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                res.status(HttpStatus.UNAUTHORIZED).json({ message: error.message });
            } else if (error instanceof ConflictException) {
                res.status(HttpStatus.CONFLICT).json({ message: error.message });
            } else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
            }
        }
    }

    @Post('register')
    async register(
        @Body() registerDto: RegisterDto,
        @Res() res: Response,
    ): Promise<void> {
        try {
            const { message } = await this.authService.register(registerDto);
            res.status(HttpStatus.CREATED).json({ message });
        } catch (error) {
            if (error instanceof ConflictException) {
                res.status(HttpStatus.CONFLICT).json({ message: error.message });
            } else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
            }
        }
    }
}
