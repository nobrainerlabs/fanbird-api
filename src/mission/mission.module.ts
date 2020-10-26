import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MissionController } from './mission.controller';
import { Mission } from './mission.entity';
import { MissionService } from './mission.service';

@Module({
  imports: [TypeOrmModule.forFeature([Mission])],
  exports: [TypeOrmModule, MissionService],
  controllers: [MissionController],
  providers: [MissionService],
})
export class MissionModule {}
