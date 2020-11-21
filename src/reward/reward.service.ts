import { FindOneOptions, Repository } from 'typeorm';

import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Reward, RewardCreateDto, RewardUpdateDto } from './reward.entity';

@Injectable()
export class RewardService {
  constructor(
    @InjectRepository(Reward)
    private rewardRepository: Repository<Reward>,
  ) {}

  async findAll(opts?): Promise<Reward[]> {
    return this.rewardRepository.find(opts);
  }

  async findOne(opts): Promise<Reward> {
    return this.rewardRepository.findOne(opts);
  }

  async remove(id: number): Promise<void> {
    const entity = await this.findOne(id);
    if (!entity) {
      throw new NotFoundException();
    }
    await this.rewardRepository.softDelete(id);
  }

  async create(dto: RewardCreateDto): Promise<Reward> {
    try {
      return this.rewardRepository.save(dto);
    } catch (e) {
      if (e.code === '23505') {
        throw new ConflictException();
      }
      throw new InternalServerErrorException();
    }
  }

  async update(id: number, dto: RewardUpdateDto): Promise<Reward> {
    try {
      await this.rewardRepository.update(id, dto);
      return this.findOne(id);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
