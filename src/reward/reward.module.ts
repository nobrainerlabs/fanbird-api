import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RewardController } from './reward.controller';
import { Reward } from './reward.entity';
import { RewardService } from './reward.service';

@Module({
  imports: [TypeOrmModule.forFeature([Reward])],
  exports: [TypeOrmModule, RewardService],
  controllers: [RewardController],
  providers: [RewardService]
})
export class RewardModule {}
