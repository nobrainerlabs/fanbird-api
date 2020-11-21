import { RewardService } from './../reward/reward.service';
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
  BadRequestException,
  ForbiddenException,
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
    private rewardService: RewardService,
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
    const reward = await this.rewardService.findOne(dto.rewardId);
    const user = await this.userService.findOne(dto.userId);

    if (user.points < reward.points) {
      throw new BadRequestException('insufficient points');
    }

    const res = await this.userRewardRepository.save(dto);
    const userReward = await this.findOne(res.id);
    await this.userService.deductPoints(
      userReward.userId,
      userReward.reward.points,
    );
    return userReward;
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
