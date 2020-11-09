import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BrandController } from './brand.controller';
import { Brand } from './brand.entity';
import { BrandService } from './brand.service';

@Module({
  imports: [TypeOrmModule.forFeature([Brand])],
  exports: [TypeOrmModule, BrandService],
  controllers: [BrandController],
  providers: [BrandService]
})
export class BrandModule {}
