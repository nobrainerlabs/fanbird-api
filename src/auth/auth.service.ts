import {
  User,
  UserChoosePasswordDto,
  UserSsoDto,
  UserSource,
} from './../user/user.entity';
import { MailerService } from '@nestjs-modules/mailer';
import {
  Injectable,
  Logger,
  UnauthorizedException,
  NotFoundException,
  InternalServerErrorException,
  HttpService,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import {
  UserLoginDto,
  UserForgotPasswordDto,
  UserTokenDto,
} from '../user/user.entity';
import { UserService } from '../user/user.service';
import { access } from 'fs';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private mailerService: MailerService,
    private httpService: HttpService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findByEmail(username);

    if (!user) throw new NotFoundException();

    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(userLoginDto: UserLoginDto): Promise<UserTokenDto> {
    let user = await this.userService.login(userLoginDto);
    if (!user) throw new UnauthorizedException();

    const accessToken = await this.generateAccessToken(user);
    user = await this.userService.loggedIn(user);
    return {
      user,
      accessToken,
      expiresIn: process.env.JWT_EXPIRATION,
    };
  }

  async loginGoogle(req): Promise<UserTokenDto> {
    if (!req.user) {
      throw new InternalServerErrorException('error during google sso');
    }

    let user = await this.userService.findOne({
      where: { email: req.user.email },
    });

    if (!user) {
      const dto = new UserSsoDto();
      dto.source = UserSource.google;
      dto.email = req.user.email;
      dto.firstName = req.user.firstName;
      dto.lastName = req.user.lastName;
      dto.picture = req.user.picture;
      user = await this.userService.create(dto);
    }

    const accessToken = await this.generateAccessToken(user);
    user = await this.userService.loggedIn(user);
    return {
      user,
      accessToken,
      expiresIn: process.env.JWT_EXPIRATION,
    };
  }

  async loginFacebook(req): Promise<UserTokenDto> {
    if (!req.user) {
      throw new InternalServerErrorException('error during facebook sso');
    }

    let user = await this.userService.findOne({
      where: { email: req.user.email },
    });

    if (!user) {
      const dto = new UserSsoDto();
      dto.source = UserSource.facebook;
      dto.email = req.user.email;
      dto.firstName = req.user.firstName;
      dto.lastName = req.user.lastName;
      user = await this.userService.create(dto);
    }

    const accessToken = await this.generateAccessToken(user);
    user = await this.userService.loggedIn(user);
    return {
      user,
      accessToken,
      expiresIn: process.env.JWT_EXPIRATION,
    };
  }

  async loginInstagram(req): Promise<UserTokenDto> {
    if (!req.user) {
      throw new InternalServerErrorException('error during instagram sso');
    }

    let user = await this.userService.findOne({
      where: { email: req.user.email },
    });

    if (!user) {
      const dto = new UserSsoDto();
      dto.source = UserSource.instagram;
      dto.email = req.user.email;
      dto.firstName = req.user.firstName;
      dto.lastName = req.user.lastName;
      user = await this.userService.create(dto);
    }

    const accessToken = await this.generateAccessToken(user);
    user = await this.userService.loggedIn(user);
    return {
      user,
      accessToken,
      expiresIn: process.env.JWT_EXPIRATION,
    };
  }

  async forgotPassword(
    userForgotPasswordDto: UserForgotPasswordDto,
  ): Promise<void> {
    const user = await this.userService.findByEmail(
      userForgotPasswordDto.email,
    );
    if (!user) throw new NotFoundException();
    if (user) {
      const accessToken = await this.generateAccessToken(user);
      const res = await this.sendResetPasswordEmail(user, accessToken);
      Logger.log(`forgot password: ${JSON.stringify(res)}`);
    }
  }

  async choosePassword(
    userChoosePasswordDto: UserChoosePasswordDto,
  ): Promise<User> {
    Logger.log('choosing password');
    const user = await this.userService.findOne({
      where: { accessToken: userChoosePasswordDto.accessToken },
    });
    if (!user) throw new NotFoundException();
    return await this.userService.update(user.id, {
      password: userChoosePasswordDto.password,
    });
  }

  async sendResetPasswordEmail(user: User, accessToken: string): Promise<any> {
    return this.mailerService.sendMail({
      to: user.email,
      subject: 'Forgot Password',
      text: `Forgot your password? Click here to reset it: ${process.env.WEB_EMAIL_RESET_PASWORD_URL}?accessToken=${accessToken}`,
      html: `Click here to reset your password: <a href="${process.env.WEB_EMAIL_RESET_PASWORD_URL}?accessToken=${accessToken}">Reset Password</b>`,
    });
  }

  async generateAccessToken(user: User): Promise<string> {
    return this.jwtService.sign({ sub: user.id });
  }
}
