import { Brand } from './../brand/brand.entity';
import { UserMission } from './../userMission/userMission.entity';
import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Mission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  brandId: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  type: string;

  @Column({ nullable: true })
  picture?: string;

  @Column({ type: 'int', default: 0 })
  points: number;

  @Column({ type: 'jsonb', default: {} })
  meta: object;

  @Column({ type: 'jsonb', default: {} })
  media: object;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  public deletedAt: Date;

  @ManyToOne((type) => Brand, (brand) => brand.missions)
  public brand?: Brand;

  @OneToMany((type) => UserMission, (userMission) => userMission.mission)
  public userMissions?: UserMission[];
}

export class MissionCreateDto {
  @IsNotEmpty()
  name: string;
  description: string;
  @IsNotEmpty()
  type: string;
  @IsNotEmpty()
  points: number;
  @IsNotEmpty()
  meta: object;
  @IsNotEmpty()
  media: object;
}

export class MissionUpdateDto {
  @IsOptional()
  name?: string;
}
