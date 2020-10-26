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

import { Mission, MissionCreateDto, MissionUpdateDto } from './mission.entity';

@Injectable()
export class MissionService {
  constructor(
    @InjectRepository(Mission)
    private missionRepository: Repository<Mission>,
  ) {}

  async findAll(opts?): Promise<Mission[]> {
    return this.missionRepository.find(opts);
  }

  async findOne(opts): Promise<Mission> {
    return this.missionRepository.findOne(opts);
  }

  async remove(id: number): Promise<void> {
    const entity = await this.findOne(id);
    if (!entity) {
      throw new NotFoundException();
    }
    await this.missionRepository.softDelete(id);
  }

  async create(dto: MissionCreateDto): Promise<Mission> {
    try {
      return this.missionRepository.save(dto);
    } catch (e) {
      if (e.code === '23505') {
        throw new ConflictException();
      }
      throw new InternalServerErrorException();
    }
  }

  async update(id: number, dto: MissionUpdateDto): Promise<Mission> {
    try {
      await this.missionRepository.update(id, dto);
      return this.findOne(id);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
