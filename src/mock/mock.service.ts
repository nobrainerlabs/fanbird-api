
import { FindOneOptions, Repository } from 'typeorm';

import {
    ConflictException, Injectable, InternalServerErrorException, Logger, NotFoundException,
    UnauthorizedException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Mock, MockCreateDto, MockUpdateDto } from './mock.entity';

@Injectable()
export class MockService {
  constructor(
    @InjectRepository(Mock)
    private mockRepository: Repository<Mock>,
  ) {}

  async findAll(opts?): Promise<Mock[]> {
    return this.mockRepository.find(opts);
  }

  async findOne(opts): Promise<Mock> {
    return this.mockRepository.findOne(opts);
  }

  async remove(id: number): Promise<void> {
    const entity = await this.findOne(id);
    if (!entity) {
      throw new NotFoundException();
    }
    await this.mockRepository.softDelete(id);
  }

  async create(dto: MockCreateDto): Promise<Mock> {
    try {
      return this.mockRepository.save(dto);
    } catch (e) {
      if (e.code === '23505') {
        throw new ConflictException();
      }
      throw new InternalServerErrorException();
    }
  }

  async update(id: number, dto: MockUpdateDto): Promise<Mock> {
    try {
      await this.mockRepository.update(id, dto);
      return this.findOne(id);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
