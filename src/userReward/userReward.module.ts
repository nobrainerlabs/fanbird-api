import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserRewardController } from './userReward.controller';
import { UserReward } from './userReward.entity';
import { UserRewardService } from './userReward.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserReward])],
  exports: [TypeOrmModule, UserRewardService],
  controllers: [UserRewardController],
  providers: [UserRewardService]
})
export class UserRewardModule {}
