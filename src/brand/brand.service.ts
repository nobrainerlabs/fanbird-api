
import { FindOneOptions, Repository } from 'typeorm';

import {
    ConflictException, Injectable, InternalServerErrorException, Logger, NotFoundException,
    UnauthorizedException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Brand, BrandCreateDto, BrandUpdateDto } from './brand.entity';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
  ) {}

  async findAll(opts?): Promise<Brand[]> {
    return this.brandRepository.find(opts);
  }

  async findOne(opts): Promise<Brand> {
    return this.brandRepository.findOne(opts);
  }

  async remove(id: number): Promise<void> {
    const entity = await this.findOne(id);
    if (!entity) {
      throw new NotFoundException();
    }
    await this.brandRepository.softDelete(id);
  }

  async create(dto: BrandCreateDto): Promise<Brand> {
    try {
      return this.brandRepository.save(dto);
    } catch (e) {
      if (e.code === '23505') {
        throw new ConflictException();
      }
      throw new InternalServerErrorException();
    }
  }

  async update(id: number, dto: BrandUpdateDto): Promise<Brand> {
    try {
      await this.brandRepository.update(id, dto);
      return this.findOne(id);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
