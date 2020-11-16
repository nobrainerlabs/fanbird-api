import { UserMission } from './userMission.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserMissionService } from './userMission.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserMission])],
  exports: [UserMissionService],
  providers: [UserMissionService],
})
export class UserMissionModule {}
