import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';
import { FacebookService } from '../facebook.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
    constructor(
        private readonly facebookService: FacebookService,
        private configService: ConfigService
    ) {
        super({
            clientID: configService.get<string>('FACEBOOK_APP_ID'),
            clientSecret: configService.get<string>('FACEBOOK_APP_SECRET'),
            callbackURL: 'http://localhost:3000/auth/facebook/redirect',
            scope: ['email', 'public_profile'],
            profileFields: ['id', 'name', 'displayName', 'emails', 'photos'],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: (err: any, user: any, info?: any) => void
    ): Promise<any> {
        if (!profile || !profile._json) {
            console.error('Error fetching Facebook profile:', profile);
            return done(new BadRequestException('Facebook profile data not found'), null);
        }
        const user = await this.facebookService.validateFacebookLogin(profile._json, accessToken);
        return user;
    }
}
