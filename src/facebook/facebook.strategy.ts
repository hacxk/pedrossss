import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-facebook';
import { ConfigService } from '@nestjs/config';
import { FacebookService } from './facebook.service';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(
    private readonly configService: ConfigService,
    private readonly facebookService: FacebookService,
  ) {
    super({
      clientID: configService.get('FACEBOOK_APP_ID'),
      clientSecret: configService.get('FACEBOOK_APP_SECRET'),
      callbackURL: 'http://localhost:3000/auth/facebook/callback',
      scope: ['email'],
      profileFields: ['emails', 'name'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: (error: any, user?: any, info?: any) => void,
  ) {
    const { name, emails } = profile;
    const user = await this.facebookService.findOrCreate({
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
    });
    done(null, user);
  }
}