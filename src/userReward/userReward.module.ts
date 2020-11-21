import { User } from './../user/user.entity';
import { UserModule } from './../user/user.module';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserRewardController } from './userReward.controller';
import { UserReward } from './userReward.entity';
import { UserRewardService } from './userReward.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserReward, User]),
    forwardRef(() => UserModule),
  ],
  exports: [TypeOrmModule, UserRewardService],
  controllers: [UserRewardController],
  providers: [UserRewardService],
})
export class UserRewardModule {}
