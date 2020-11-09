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

import { Mission, MissionUpdateDto, MissionCreateDto } from './mission.entity';
import { MissionService } from './mission.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@Controller('missions')
export class MissionController {
  constructor(private missionService: MissionService) {}

  @Get()
  @ApiOperation({
    summary: 'Get missions',
    description: 'Retrieve a list of missions',
  })
  async findAll(@Query('brandId') brandId?: number) {
    const opts = {
      where: {
        brandId: undefined,
      },
    };
    if (brandId) {
      opts.where.brandId = brandId;
    }
    return this.missionService.findAll(opts);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get mission',
    description: 'Retrieves a mission record by id',
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const mission = await this.missionService.findOne(id);
    if (!mission) throw new NotFoundException();
    return mission;
  }

  @Post()
  @ApiOperation({
    summary: 'Create mission',
    description: 'Creates a mission record',
  })
  async create(@Body() dto: MissionCreateDto): Promise<Mission> {
    return await this.missionService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update mission',
    description: 'Update a mission record',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: MissionUpdateDto,
  ): Promise<Mission> {
    return await this.missionService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete mission',
    description: 'Delete a mission record',
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.missionService.remove(id);
  }
}
