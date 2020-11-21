import { UserService } from './../user/user.service';
import { FindOneOptions, Repository } from 'typeorm';

import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  UserReward,
  UserRewardCreateDto,
  UserRewardUpdateDto,
} from './userReward.entity';

@Injectable()
export class UserRewardService {
  constructor(
    @InjectRepository(UserReward)
    private userRewardRepository: Repository<UserReward>,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) {}

  async findAll(opts?): Promise<UserReward[]> {
    return this.userRewardRepository.find(opts);
  }

  async findOne(opts): Promise<UserReward> {
    return this.userRewardRepository.findOne(opts);
  }

  async remove(id: number): Promise<void> {
    const entity = await this.findOne(id);
    if (!entity) {
      throw new NotFoundException();
    }
    await this.userRewardRepository.softDelete(id);
  }

  async create(dto: UserRewardCreateDto): Promise<UserReward> {
    try {
      const res = await this.userRewardRepository.save(dto);
      const userReward = await this.findOne(res.id);
      await this.userService.deductPoints(
        userReward.userId,
        userReward.reward.points,
      );
      return userReward;
    } catch (e) {
      if (e.code === '23505') {
        throw new ConflictException();
      }
      throw new InternalServerErrorException();
    }
  }

  async update(id: number, dto: UserRewardUpdateDto): Promise<UserReward> {
    try {
      await this.userRewardRepository.update(id, dto);
      return this.findOne(id);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
