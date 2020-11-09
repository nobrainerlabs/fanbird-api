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

import { Brand, BrandUpdateDto, BrandCreateDto } from './brand.entity';
import { BrandService } from './brand.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@Controller('brands')
export class BrandController {
  constructor(private brandService: BrandService) {}

  @Get()
  @ApiOperation({
    summary: 'Get brands',
    description: 'Retrieve a list of brands',
  })
  async findAll(@Body() data) {
    return this.brandService.findAll(data);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get brand',
    description: 'Retrieves a brand record by id',
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const brand = await this.brandService.findOne(id);
    if (!brand) throw new NotFoundException();
    return brand;
  }

  @Get('slug/:slug')
  @ApiOperation({
    summary: 'Get brand by slug',
    description: 'Retrieves a brand record by slug',
  })
  async findBySlug(@Param('slug') slug: string) {
    slug = slug.toLowerCase();
    const brand = await this.brandService.findOne({ where: { slug } });
    if (!brand) throw new NotFoundException();
    return brand;
  }

  @Post()
  @ApiOperation({
    summary: 'Create brand',
    description: 'Creates a brand record',
  })
  async create(@Body() dto: BrandCreateDto): Promise<Brand> {
    return await this.brandService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update brand',
    description: 'Update a brand record',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: BrandUpdateDto,
  ): Promise<Brand> {
    return await this.brandService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete brand',
    description: 'Delete a brand record',
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.brandService.remove(id);
  }
}
