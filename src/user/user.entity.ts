import { UserReward } from './../userReward/userReward.entity';
import { UserMission } from './../userMission/userMission.entity';
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

export enum UserRoles {
  admin = 'admin',
  user = 'user',
}

export enum UserSource {
  facebook = 'facebook',
  google = 'google',
  email = 'email',
  instagram = 'instagram',
}

@Entity()
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: UserSource.email })
  @IsNotEmpty()
  source: UserSource;

  @Column('jsonb', { default: [UserRoles.user] })
  roles: UserRoles;

  @Column()
  email: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ type: 'int', default: 0 })
  points: number;

  @Column({ nullable: true })
  username?: string;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ nullable: true })
  street1?: string;

  @Column({ nullable: true })
  street2?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  state?: string;

  @Column({ nullable: true })
  zip?: string;

  @Column({ nullable: true })
  country?: string;

  @Column({ nullable: true })
  picture?: string;

  @Column('jsonb', {
    default: {
      plan: '',
      notifications: {
        newUser: false,
      },
    },
  })
  settings: {};

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  public deletedAt: Date;

  @Column('timestamptz', { nullable: true })
  @IsOptional()
  lastLoginAt?: Date;

  @OneToMany((type) => UserMission, (userMission) => userMission.user, {
    cascade: true,
    eager: true,
  })
  public userMissions?: UserMission[];

  @OneToMany((type) => UserReward, (userReward) => userReward.user)
  public userRewards?: UserReward[];
}

export class UserRegisterDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  source?: UserSource;
  username?: string;
  firstName?: string;
  lastName?: string;
  street1?: string;
  street2?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  picture?: string;
}

export class UserUpdateDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  password?: string;

  firstName?: string;
  lastName?: string;
  street1?: string;
  street2?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  picture?: string;
  lastLoginAt?: Date;
}

export class UserLoginDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
export class UserForgotPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class UserChoosePasswordDto {
  @IsNotEmpty()
  accessToken: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;
}

export class UserTokenDto {
  user: User;
  accessToken: string;
  expiresIn: string;
}

export class UserSsoGoogleDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  source: UserSource;

  @IsNotEmpty()
  picture: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;
}

export class UserSsoFacebookDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  source: UserSource;

  @IsOptional()
  picture: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;
}

export class UserSsoDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  source: UserSource;

  @IsOptional()
  picture: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;
}
