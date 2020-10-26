import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Mission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  instruction: string;

  @Column()
  type: string;

  @Column({ type: 'int', default: 0 })
  points: number;

  @Column({ type: 'jsonb', default: {} })
  meta: string;

  @Column({ type: 'jsonb', default: {} })
  media: string;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  public deletedAt: Date;
}

export class MissionCreateDto {
  @IsNotEmpty()
  name: string;
}

export class MissionUpdateDto {
  @IsOptional()
  name?: string;
}
