import { RewardModule } from './../reward/reward.module';
import { UserReward } from './../userReward/userReward.entity';
import { UserRewardModule } from './../userReward/userReward.module';
import { UserMissionModule } from './../userMission/userMission.module';

import { MissionModule } from './../mission/mission.module';
import { UserMission } from './../userMission/userMission.entity';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserMission, UserReward]),
    MissionModule,
    UserMissionModule,
    forwardRef(() => UserRewardModule),
  ],
  exports: [TypeOrmModule, UserService],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
