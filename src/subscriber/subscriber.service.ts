
import { FindOneOptions, Repository } from 'typeorm';

import {
    ConflictException, Injectable, InternalServerErrorException, Logger, NotFoundException,
    UnauthorizedException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Subscriber, SubscriberCreateDto, SubscriberUpdateDto } from './subscriber.entity';

@Injectable()
export class SubscriberService {
  constructor(
    @InjectRepository(Subscriber)
    private subscriberRepository: Repository<Subscriber>,
  ) {}

  async findAll(opts?): Promise<Subscriber[]> {
    return this.subscriberRepository.find(opts);
  }

  async findOne(opts): Promise<Subscriber> {
    return this.subscriberRepository.findOne(opts);
  }

  async remove(id: number): Promise<void> {
    const entity = await this.findOne(id);
    if (!entity) {
      throw new NotFoundException();
    }
    await this.subscriberRepository.softDelete(id);
  }

  async create(dto: SubscriberCreateDto): Promise<Subscriber> {
    try {
      return this.subscriberRepository.save(dto);
    } catch (e) {
      if (e.code === '23505') {
        throw new ConflictException();
      }
      throw new InternalServerErrorException();
    }
  }

  async update(id: number, dto: SubscriberUpdateDto): Promise<Subscriber> {
    try {
      await this.subscriberRepository.update(id, dto);
      return this.findOne(id);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
