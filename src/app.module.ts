import { UtilityModule } from './utility/utility.module';
import { UserRewardModule } from './userReward/userReward.module';
import { RewardModule } from './reward/reward.module';
import { AccessControlModule } from 'nest-access-control';
import { CommandModule } from 'nestjs-command';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { roles } from './app.roles';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BrandModule } from './brand/brand.module';
import { CrudCommand } from './crud/crud.command';
import { CrudModule } from './crud/crud.module';
import { InstagramModule } from './instagram/instagram.module';
import { MissionModule } from './mission/mission.module';
import { SubscriberModule } from './subscriber/subscriber.module';
import { UserCommand } from './user/user.command';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as any,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT as any,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts|.js}'],
      synchronize: true,
      logging: true,
      autoLoadEntities: true,
      namingStrategy: new SnakeNamingStrategy(),
      keepConnectionAlive: true,
    }),
    MailerModule.forRoot({
      transport: process.env.SMTP_TRANSPORT, // SMTP_TRANSPORT=smtps://nobrainerlabs@gmail.com:secure1234@smtp.gmail.com
      defaults: {
        from: process.env.SMTP_FROM, // SMTP_FROM="Nobrainer Labs" <nobrainerlabs@gmail.com>
      },
    }),
    AccessControlModule.forRoles(roles),
    UserModule,
    CommandModule,
    AuthModule,
    CrudModule,
    MissionModule,
    InstagramModule,
    BrandModule,
    SubscriberModule,
    RewardModule,
    UserRewardModule,
    UtilityModule,
  ],
  controllers: [AppController],
  providers: [AppService, UserCommand, CrudCommand],
})
export class AppModule {}
