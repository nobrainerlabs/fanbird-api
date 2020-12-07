import { Mission } from './../mission/mission.entity';
import { User } from './../user/user.entity';
import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Brand {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'jsonb', default: [] })
  owners: User[];

  @Column()
  name: string;

  @Column({ nullable: true })
  picture?: string;

  @Column()
  slug: string;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  public deletedAt: Date;

  @OneToMany((type) => Mission, (mission) => mission.brand, { eager: true })
  public missions?: Mission[];
}

export class BrandCreateDto {
  @IsNotEmpty()
  name: string;
}

export class BrandUpdateDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  picture?: string;
}
