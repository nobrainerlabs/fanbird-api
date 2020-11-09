import { UserModule } from './../user/user.module';
import { forwardRef, HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { InstagramController } from './instagram.controller';

import { InstagramService } from './instagram.service';

@Module({
  imports: [HttpModule, forwardRef(() => UserModule)],
  exports: [InstagramService],
  controllers: [InstagramController],
  providers: [InstagramService],
})
export class InstagramModule {}
