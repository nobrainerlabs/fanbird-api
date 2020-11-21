import { Reward } from './../reward/reward.entity';
import { User } from './../user/user.entity';
import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Unique,
} from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

@Entity()
export class UserReward {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  public userId!: number;

  @Column()
  public rewardId!: number;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  public deletedAt: Date;

  @ManyToOne((type) => User, (user) => user.userRewards)
  public user!: User;

  @ManyToOne((type) => Reward, (reward) => reward.userRewards)
  public reward!: Reward;
}

export class UserRewardCreateDto {
  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  rewardId: number;
}

export class UserRewardUpdateDto {
  @IsOptional()
  rewardId?: number;
}

export class UserRewardFindAllDto {
  @IsNotEmpty()
  @Transform((value) => Number(value))
  userId: number;
}
