import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-instagram';

@Injectable()
export class InstagramStrategy extends PassportStrategy(Strategy, 'instagram') {
  constructor() {
    super({
      clientID: process.env.INSTAGRAM_APP_ID,
      clientSecret: process.env.INSTAGRAM_APP_SECRET,
      callbackURL: process.env.INSTAGRAM_CALLBACK_URL,
      scope: 'user_profile,user_media',
      profileFields: ['id', 'username'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: any, user: any, info?: any) => void,
  ): Promise<any> {
    console.log('validate insta', profile);
    const user = {
      email: 'insta@gram.com',
      firstName: 'jsa',
      lastName: 'sef',
      accessToken,
    };
    done(null, user);
  }
}
