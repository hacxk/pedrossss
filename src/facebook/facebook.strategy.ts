import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-facebook';
import { ConfigService } from '@nestjs/config';
import { FacebookService } from './facebook.service';
import { Request } from 'express'; // Import the Express Request interface

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  private readonly logger = new Logger(FacebookStrategy.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly facebookService: FacebookService,
  ) {
    super({
      clientID: configService.get('FACEBOOK_APP_ID'),
      clientSecret: configService.get('FACEBOOK_APP_SECRET'),
      callbackURL: configService.get('FACEBOOK_CALLBACK_URL'), 
      scope: ['email', 'public_profile'], 
      profileFields: ['id', 'emails', 'name'], 
      passReqToCallback: true, 
    });
  }

  async validate(
    req: Request, // Use the imported Express Request type
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: (err: any, user?: any, info?: any) => void,
  ) {
    const redirectUri = req.query?.state || this.configService.get('FACEBOOK_CALLBACK_URL'); 

    this.logger.log(`Received Facebook profile: ${JSON.stringify(profile, null, 2)}`);
    this.logger.log(`Using redirect URI: ${redirectUri}`);

    try {
      const { id, name, emails } = profile;
      const user = await this.facebookService.findOrCreate({
        email: emails[0].value,
        firstName: name.givenName,
        lastName: name.familyName,
      });

      this.logger.log(`User authenticated: ${user.email}`);
      done(null, user); 
    } catch (error) {
      this.logger.error(`Error during Facebook authentication: ${error.message}`);
      done(error, false); 
    }
  }
}
