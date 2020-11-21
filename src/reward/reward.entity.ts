import { UserReward } from './../userReward/userReward.entity';
import { IsNotEmpty, IsOptional } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum RewardStatus {
  Active = 'active',
  Inactive = 'inactive',
}

export enum RewardType {
  Coupon = 'coupon',
  Product = 'product',
}

@Entity()
export class Reward {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  brandId: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ default: 0 })
  points: number;

  @Column({ nullable: true })
  expireAt?: Date;

  @Column({ default: RewardStatus.Active })
  status: RewardStatus;

  @Column({ default: RewardType.Coupon })
  type: RewardType;

  @Column({ type: 'jsonb', default: {} })
  meta: object;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  public deletedAt: Date;

  @OneToMany((type) => UserReward, (userReward) => userReward.reward)
  public userRewards?: UserReward[];
}

export class RewardCreateDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  brandId: number;

  @IsNotEmpty()
  points: number;

  reward?: object;
  type?: RewardType;
  status?: RewardStatus;
  description?: string;
  expireAt?: Date;
}

export class RewardUpdateDto {
  name?: string;
  brandId?: number;
  points?: number;
  status?: RewardStatus;

  reward?: object;
  type?: RewardType;
  description?: string;
  expireAt?: Date;
}

export class RewardFindAllDto {
  @IsNotEmpty()
  brandId: number;
}
