import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

import {
  Reward,
  RewardUpdateDto,
  RewardCreateDto,
  RewardFindAllDto,
} from './reward.entity';
import { RewardService } from './reward.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@Controller('rewards')
export class RewardController {
  constructor(private rewardService: RewardService) {}

  @Get()
  @ApiOperation({
    summary: 'Get rewards',
    description: 'Retrieve a list of rewards',
  })
  async findAll(@Query() dto: RewardFindAllDto) {
    const opts = {
      where: {
        brandId: dto.brandId,
      },
    };
    return this.rewardService.findAll(opts);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get reward',
    description: 'Retrieves a reward record by id',
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const reward = await this.rewardService.findOne(id);
    if (!reward) throw new NotFoundException();
    return reward;
  }

  @Post()
  @ApiOperation({
    summary: 'Create reward',
    description: 'Creates a reward record',
  })
  async create(@Body() dto: RewardCreateDto): Promise<Reward> {
    return await this.rewardService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update reward',
    description: 'Update a reward record',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: RewardUpdateDto,
  ): Promise<Reward> {
    return await this.rewardService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete reward',
    description: 'Delete a reward record',
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.rewardService.remove(id);
  }
}
