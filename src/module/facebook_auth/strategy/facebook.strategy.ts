import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';
import { FacebookService } from '../facebook.service';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
    constructor(private readonly facebookService: FacebookService) {
        super({
            clientID: process.env.FACEBOOK_APP_ID,
            clientSecret: process.env.FACEBOOK_APP_SECRET,
            callbackURL: 'http://localhost:3000/auth/facebook/redirect',
            scope: ['email', 'public_profile'],
            profileFields: ['id', 'name', 'displayName', 'emails', 'photos'],
        });
    }

    async validate(
        accessToken: string,
        profile: Profile,
    ): Promise<any> {
        const user = await this.facebookService.validateFacebookLogin(profile._json, accessToken);
        return user;
    }
}
