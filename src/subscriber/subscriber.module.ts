import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SubscriberController } from './subscriber.controller';
import { Subscriber } from './subscriber.entity';
import { SubscriberService } from './subscriber.service';

@Module({
  imports: [TypeOrmModule.forFeature([Subscriber])],
  exports: [TypeOrmModule, SubscriberService],
  controllers: [SubscriberController],
  providers: [SubscriberService]
})
export class SubscriberModule {}
