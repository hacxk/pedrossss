import { Injectable, BadRequestException, ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto'; 
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private configService: ConfigService
    ) { }

    async registerUser(userData: RegisterDto) {
        if (!userData || !userData.password || !userData.email) {
            throw new BadRequestException('Please provide User valid information to register');
        }
        const checkUser = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { email: userData.email },
                    { username: userData.username }
                ]
            }
        });
        if (checkUser) {
            throw new ConflictException("User with this email or Username Already exists")
        }
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(userData.password, salt);
        const user = await this.prisma.user.create({
            data: {
                username: userData.username,
                email: userData.email,
                password: hashedPassword,
                name: userData.name,
            },
        });
        const { password, ...userWithoutPassword } = user;
        return { success: true, data: userWithoutPassword, info: "to login send request to /auth/login with your username or email with password" };
    }

    async loginUser(loginData: LoginDto, res: Response) {
        if (!loginData || (!loginData.email && !loginData.username) || !loginData.password) {
            throw new BadRequestException('Please provide valid login information.');
        }
        const user = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { username: loginData.username },
                    { email: loginData.email }
                ],
            }
        });
        if (!user) {
            throw new UnauthorizedException('Invalid email/username or password.')
        }
        const decryptPassowrd = await bcrypt.compare(loginData.password, user.password);
        if (!decryptPassowrd) {
            throw new UnauthorizedException('Invalid email/username or password.')
        }
        const payload = { id: user.id, username: user.username }
        const token = await this.jwtService.sign(payload);
        res.cookie('authToken', token, { httpOnly: true, secure: this.configService.get<String>('NODE_ENV') === 'production', maxAge: 86400000 })
        return { success: true, info: "Login Success!" }
    }
}
