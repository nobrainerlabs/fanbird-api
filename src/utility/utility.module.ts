import { Global, Module } from '@nestjs/common';
import { UtilityService } from './utility.service';

@Global()
@Module({
  exports: [UtilityService],
  providers: [UtilityService],
})
export class UtilityModule {}
