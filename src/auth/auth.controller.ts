import { AuthGuard } from '@nestjs/passport';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpService,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

import {
  UserChoosePasswordDto,
  UserForgotPasswordDto,
  UserLoginDto,
} from '../user/user.entity';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private httpService: HttpService,
  ) {}

  @Post('login')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Authenticate login',
    description: 'Authenticate user by email and password',
  })
  async login(@Body() userLoginDto: UserLoginDto) {
    return this.authService.login(userLoginDto);
  }

  @Post('forgot-password')
  @ApiOperation({
    summary: 'Forgot password request',
    description:
      'Initiate reset password and sends out a reset password email to the user',
  })
  async forgotPassword(@Body() userForgotPassword: UserForgotPasswordDto) {
    return this.authService.forgotPassword(userForgotPassword);
  }

  @Post('choose-password')
  @ApiOperation({
    summary: 'Choose a user password',
    description: 'Sets user password with a new one',
  })
  async choosePassword(@Body() userChoosePassword: UserChoosePasswordDto) {
    return this.authService.choosePassword(userChoosePassword);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req): Promise<void> {
    return;
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    try {
      const userToken = await this.authService.loginGoogle(req);
      res.redirect(
        `${process.env.WEB_SSO_SUCCESS_URL}?jae=1&accessToken=${userToken.accessToken}`,
      );
    } catch (err) {
      res.redirect(`${process.env.WEB_SSO_FAIL_URL}`);
    }
  }

  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuth(@Req() req): Promise<void> {
    return;
  }

  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuthRedirect(@Req() req, @Res() res) {
    try {
      const userToken = await this.authService.loginFacebook(req);
      res.redirect(
        `${process.env.WEB_SSO_SUCCESS_URL}?accessToken=${userToken.accessToken}`,
      );
    } catch (err) {
      res.redirect(`${process.env.WEB_SSO_FAIL_URL}`);
    }
  }

  @Post('instagram/exchange-code')
  async instagramExchangeCode(@Body() body) {
    const payload = {
      client_id: process.env.INSTAGRAM_APP_ID,
      client_secret: process.env.INSTAGRAM_APP_SECRET,
      code: body.code,
      grant_type: 'authorization_code',
      redirect_uri: 'https://ba0fe6473e0a.ngrok.io/mission',
    };
    console.log('pa', payload);
    let res;

    try {
      res = await this.httpService
        .post('https://api.instagram.com/oauth/access_token', payload)
        // .post('https://fanbird.free.beeceptor.com', payload)
        .toPromise();
    } catch (error) {
      console.log(Object.keys(error), error.message);
    }
    console.log('data', res.data);
    return { data: res.data };
  }

  @Get('instagram')
  @UseGuards(AuthGuard('instagram'))
  async instagramAuth(@Req() req): Promise<void> {
    return;
  }

  @Get('instagram/callback')
  @UseGuards(AuthGuard('instagram'))
  async instagramAuthRedirect(@Req() req, @Res() res) {
    console.log('prep redirect');
    try {
      const userToken = await this.authService.loginInstagram(req);
      console.log('got token', userToken);
      res.redirect(
        `${process.env.WEB_SSO_SUCCESS_URL}?accessToken=${userToken.accessToken}`,
      );
    } catch (err) {
      res.redirect(`${process.env.WEB_SSO_FAIL_URL}`);
    }
  }
}
