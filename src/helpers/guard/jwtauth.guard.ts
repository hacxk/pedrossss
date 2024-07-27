import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard extends PassportStrategy(Strategy) implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private reflector: Reflector,
        private configService: ConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => {
                    const cookie = request.cookies['authToken'];
                    if (cookie) {
                        return cookie;
                    }
                    return ExtractJwt.fromAuthHeaderAsBearerToken()(request);
                },
            ]),
            secretOrKey: configService.get<string>('JWT_SECRET'),
        });
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = ExtractJwt.fromExtractors([
            (request: Request) => {
                const cookie = request.cookies['authToken'];
                if (cookie) {
                    return cookie;
                }
                return ExtractJwt.fromAuthHeaderAsBearerToken()(request);
            },
        ])(request);

        if (!token) {
            throw new UnauthorizedException('Token not found. Please login to get a token');
        }
        try {
            const user = await this.jwtService.verifyAsync(token);
            request.user = user;
            const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
            if (requiredRoles && requiredRoles.length) {
                return this.hasRoles(user, requiredRoles);
            }
            return true;
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw new UnauthorizedException('Token has expired');
            }
            throw new UnauthorizedException('Invalid token');
        }
    }

    private hasRoles(user: any, requiredRoles: string[]): boolean {
        const userRoles = user.roles || [];
        return requiredRoles.some(role => userRoles.includes(role));
    }
}
