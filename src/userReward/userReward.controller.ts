import { UtilityService } from './../utility/utility.service';
import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

import { Roles } from './../auth/decorators/roles.decorator';
import {
  UserReward,
  UserRewardCreateDto,
  UserRewardFindAllDto,
  UserRewardUpdateDto,
} from './userReward.entity';
import { UserRewardService } from './userReward.service';

@Controller('userRewards')
export class UserRewardController {
  constructor(
    private userRewardService: UserRewardService,
    private utilityService: UtilityService,
  ) {}

  @Roles('$authenticated')
  @Get()
  @ApiOperation({
    summary: 'Get userRewards',
    description: 'Retrieve a list of userRewards',
  })
  async findAll(@Query() dto: UserRewardFindAllDto, @Req() request) {
    if (!this.utilityService.hasRole('admin', request.user)) {
      dto.userId = request.user.id;
    }
    if (request.user?.id !== dto.userId) {
      throw new ForbiddenException();
    }
    const opts = {
      where: {
        userId: dto.userId,
      },
      order: {
        id: 'DESC',
      },
    };
    return this.userRewardService.findAll(opts);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get userReward',
    description: 'Retrieves a userReward record by id',
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const userReward = await this.userRewardService.findOne(id);
    if (!userReward) throw new NotFoundException();
    return userReward;
  }

  @Post()
  @ApiOperation({
    summary: 'Create userReward',
    description: 'Creates a userReward record',
  })
  async create(@Body() dto: UserRewardCreateDto): Promise<UserReward> {
    return this.userRewardService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update userReward',
    description: 'Update a userReward record',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UserRewardUpdateDto,
  ): Promise<UserReward> {
    return await this.userRewardService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete userReward',
    description: 'Delete a userReward record',
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.userRewardService.remove(id);
  }
}
