import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';
import { FacebookService } from '../facebook.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
    constructor(
        private readonly facebookService: FacebookService,
        private readonly configService: ConfigService
    ) {
        super({
            clientID: configService.get<string>('FACEBOOK_APP_ID'),
            clientSecret: configService.get<string>('FACEBOOK_APP_SECRET'),
            callbackURL: configService.get<string>('FACEBOOK_CALLBACK_URL') || 'http://localhost:3000/auth/facebook/redirect',
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
        try {
            if (!profile || !profile._json) {
                throw new BadRequestException('Facebook profile data not found');
            }

            const user = await this.facebookService.validateFacebookLogin(profile._json, accessToken);
            return done(null, user);
        } catch (err) {
            console.error('Error in FacebookStrategy validate method:', err);
            return done(err, false);
        }
    }
}
