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

import { UserMission } from './userMission.entity';

@Injectable()
export class UserMissionService {
  constructor(
    @InjectRepository(UserMission)
    private userMissionRepository: Repository<UserMission>,
  ) {}

  async findAll(opts?): Promise<UserMission[]> {
    return this.userMissionRepository.find(opts);
  }

  async findOne(opts): Promise<UserMission> {
    return this.userMissionRepository.findOne(opts);
  }

  async remove(id: number): Promise<void> {
    const entity = await this.findOne(id);
    if (!entity) {
      throw new NotFoundException();
    }
    await this.userMissionRepository.softDelete(id);
  }

  async create(dto): Promise<UserMission> {
    try {
      return this.userMissionRepository.save(dto);
    } catch (e) {
      if (e.code === '23505') {
        throw new ConflictException();
      }
      throw new InternalServerErrorException();
    }
  }

  async update(id: number, dto): Promise<UserMission> {
    try {
      await this.userMissionRepository.update(id, dto);
      return this.findOne(id);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
