import * as bcrypt from 'bcrypt';
import { FindOneOptions, Repository } from 'typeorm';

import { MailerService } from '@nestjs-modules/mailer';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  User,
  UserRegisterDto,
  UserSsoGoogleDto,
  UserLoginDto,
  UserUpdateDto,
  UserSource,
} from './user.entity';
import { UserMission } from '../userMission/userMission.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private mailerService: MailerService,
  ) {}

  async findAll(opts?): Promise<User[]> {
    return this.userRepository.find(opts);
  }

  async findOne(opts): Promise<User> {
    return this.userRepository.findOne(opts);
  }

  async remove(id: number): Promise<void> {
    const entity = await this.findOne(id);
    if (!entity) {
      throw new NotFoundException();
    }
    await this.userRepository.softDelete(id);
  }

  async login(userLoginDto: UserLoginDto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email: userLoginDto.email },
    });
    if (!user) {
      throw new UnauthorizedException();
    }

    const isValid = await bcrypt.compare(userLoginDto.password, user.password);

    if (!isValid) {
      throw new UnauthorizedException();
    }

    return user;
  }

  async register(dto: UserRegisterDto): Promise<User> {
    dto.password = await this.hashPassword(dto.password);
    return this.create(dto);
  }

  public async create(dto: Partial<User>): Promise<User> {
    console.log('creating', dto);
    try {
      if (!dto.username) {
        dto.username = `${dto.firstName} ${dto.lastName}`;
      }
      const user = await this.userRepository.save(dto);
      this.sendWelcomeEmail(user);
      return user;
    } catch (e) {
      if (e.code === '23505') {
        throw new ConflictException();
      }
      throw new InternalServerErrorException();
    }
  }

  async update(id: number, dto: UserUpdateDto): Promise<User> {
    if (dto.password) {
      dto.password = await this.hashPassword(dto.password);
    }
    console.log('user id', id);
    try {
      await this.userRepository.update(id, dto);
      return this.findOne(id);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async findByEmail(email: string): Promise<User> {
    return this.findOne({ where: { email } });
  }

  async sendWelcomeEmail(user) {
    this.mailerService
      .sendMail({
        to: user.email,
        subject: 'Thanks for signing up ✔',
        text: 'This is a test welcome message',
      })
      .then(() => {
        Logger.log('welcome email sent');
      })
      .catch((e) => {
        Logger.error('error sending welcome email', e);
      });
  }

  async completeMission(userId: number, missionId: number) {
    const user = await this.findOne({ where: { id: userId } });
    const mission = await this.findOne({ where: { id: missionId } });
    if (user) {
      const userMissions = user.userMissions;
      console.log('userMissions', userMissions);

      const userMission = {
        status: 'COMPLETED',
        missionId,
        userId,
      } as UserMission;

      user.userMissions = [];
    }
    return this.userRepository.save(user);
    return 1;
  }

  /**
   * declare a user have successfully been identified
   * useful for 3rd party integrations such as Segment, Intercom, and Zendesk
   */
  async loggedIn(user: User): Promise<User> {
    await this.update(user.id, { lastLoginAt: new Date() });
    return user;
  }

  async whoami() {
    return 'i am the greatest';
  }

  private async hashPassword(password: string) {
    return await bcrypt.hash(password, 14);
  }
}
