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
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

import { InstagramService } from './instagram.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@Controller('instagram')
export class InstagramController {
  constructor(private instagramService: InstagramService) {}

  @Get('code')
  @ApiOperation({
    summary: 'Get authorization code',
    description: 'Request authorization code',
  })
  async getCode(@Res() res, @Query() dto) {
    return this.instagramService.getCode(res, dto);
  }

  @Get('access-token')
  @ApiOperation({
    summary: 'Get accesstoken from code',
    description: 'Exchange auth code for access token',
  })
  async getAccessToken(@Query() dto) {
    const res = await this.instagramService.getAccessToken(dto.code, dto.state);
    const data = {
      accessToken: res.data.access_token,
      userId: res.data.user_id,
    };
    return `<html><body><script>window.opener.postMessage(${JSON.stringify(
      data,
    )}, "*"); window.close();</script></body></html>`;
  }

  @Get('hunt')
  async hunt(
    @Query('userId') userId: string,
    @Query('accessToken') accessToken: string,
    @Query('mention') mention: string,
  ) {
    return await this.instagramService.hunt(userId, accessToken, mention);
  }
}
