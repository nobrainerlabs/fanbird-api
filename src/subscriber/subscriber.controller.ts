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
  Req,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

import { Subscriber, SubscriberUpdateDto, SubscriberCreateDto } from './subscriber.entity';
import { SubscriberService } from './subscriber.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@Controller('subscribers')
export class SubscriberController {
  constructor(private subscriberService: SubscriberService) {}

  @Get()
  @ApiOperation({
    summary: 'Get subscribers',
    description: 'Retrieve a list of subscribers',
  })
  async findAll(@Body() data) {
    return this.subscriberService.findAll(data);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get subscriber',
    description: 'Retrieves a subscriber record by id',
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const subscriber = await this.subscriberService.findOne(id);
    if (!subscriber) throw new NotFoundException();
    return subscriber;
  }

  @Post()
  @ApiOperation({
    summary: 'Create subscriber',
    description: 'Creates a subscriber record',
  })
  async create(@Body() dto: SubscriberCreateDto): Promise<Subscriber> {
    return await this.subscriberService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update subscriber', description: 'Update a subscriber record' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: SubscriberUpdateDto,
  ): Promise<Subscriber> {
    return await this.subscriberService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete subscriber', description: 'Delete a subscriber record' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.subscriberService.remove(id);
  }
}
