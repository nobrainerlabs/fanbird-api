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
export class Subscriber {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  public deletedAt: Date;
}

export class SubscriberCreateDto {
  @IsNotEmpty()
  email: string;
}

export class SubscriberUpdateDto {
  @IsOptional()
  email?: string;
}
