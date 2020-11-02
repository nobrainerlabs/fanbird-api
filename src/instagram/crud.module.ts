import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { InstagramController } from './instagram.controller';

import { InstagramService } from './instagram.service';

@Module({
  imports: [HttpModule],
  exports: [InstagramService],
  controllers: [InstagramController],
  providers: [InstagramService],
})
export class InstagramModule {}
