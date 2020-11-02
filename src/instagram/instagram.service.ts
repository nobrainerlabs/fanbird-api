import { FindOneOptions, Repository } from 'typeorm';
import * as express from 'express';
import * as qs from 'qs';

import {
  BadRequestException,
  ConflictException,
  HttpService,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class InstagramService {
  constructor(private httpService: HttpService) {}

  async getCode(response: express.Response, params) {
    const state = 'jaequery';
    const url = `https://api.instagram.com/oauth/authorize?client_id=${process.env.INSTAGRAM_APP_ID}&redirect_uri=${process.env.INSTAGRAM_CALLBACK_URL}&scope=user_profile,user_media&response_type=code&state=${state}`;
    response.redirect(url);
  }

  async getAccessToken(code, state) {
    const payload = {
      client_id: process.env.INSTAGRAM_APP_ID,
      client_secret: process.env.INSTAGRAM_APP_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: process.env.INSTAGRAM_CALLBACK_URL,
      state,
    };
    try {
      const config = {
        headers: {
          'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
      };
      return await this.httpService
        .post(
          `https://api.instagram.com/oauth/access_token`,
          qs.stringify(payload),
          config,
        )
        .toPromise();
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async getUserFeed(userId: number) {
    try {
      const res = await this.makeRequest('GET', `/feed/${userId}/optional`);
      return { ...res.data };
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async hunt(userId, accessToken, mention) {
    const url = `https://graph.instagram.com/${userId}/media?fields=caption,id,media_type,media_url,permalink,thumbnail_url,timestamp&access_token=${accessToken}`;

    try {
      const res = await this.httpService.get(url).toPromise();
      const found = res.data.data.find((post) => {
        const comment = post.caption.toLowerCase();
        return comment.includes(mention.toLowerCase());
      });
      return { found };
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async makeRequest(method: string, path, data = {}) {
    const url = process.env.INSTAGRAM_RAPID_API_HOST + path;
    const payload = {
      ...data,
    };

    const config = {
      headers: {
        'x-rapidapi-host': process.env.INSTAGRAM_RAPID_API_HOST,
        'x-rapidapi-key': process.env.INSTAGRAM_RAPID_API_KEY,
      },
    };

    try {
      switch (method.toUpperCase()) {
        case 'GET':
          return await this.httpService
            .get('https://' + url, config)
            .toPromise();
        case 'POST':
          return await this.httpService
            .post(url, qs.stringify(payload), config)
            .toPromise();
      }
    } catch (e) {
      console.log('e', e);
      throw new InternalServerErrorException(e);
    }
  }
}