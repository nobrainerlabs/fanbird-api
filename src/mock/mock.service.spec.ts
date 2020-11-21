import { RewardService } from './../reward/reward.service';
import { BrandService } from './../brand/brand.service';
import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '../app.module';
import { MissionService } from '../mission/mission.service';
import { UserService } from '../user/user.service';

describe('Mock initial data', () => {
  let userService: UserService;
  let missionService: MissionService;
  let brandService: BrandService;
  let rewardService: RewardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    userService = module.get<UserService>(UserService);
    missionService = module.get<MissionService>(MissionService);
    brandService = module.get<BrandService>(BrandService);
    rewardService = module.get<RewardService>(RewardService);
  });

  it('should create user', async () => {
    const { users } = require('./samples/users');
    try {
      for (const user of users) {
        const newUser = await userService.register(user);
      }
    } catch (err) {
      console.error('error', err);
    }
  });

  it('should create brands', async () => {
    const { brands } = require('./samples/brands');
    try {
      for (const brand of brands) {
        const newBrand = await brandService.create(brand);
      }
    } catch (err) {
      console.error('err', err);
    }
  });

  it('should create missions', async () => {
    const { missions } = require('./samples/missions');
    try {
      for (const mission of missions) {
        const newMission = await missionService.create(mission);
      }
    } catch (err) {
      console.error('err', err);
    }
  });

  it('should create rewards', async () => {
    const { rewards } = require('./samples/rewards');
    try {
      for (const reward of rewards) {
        const newReward = await rewardService.create(reward);
      }
    } catch (err) {
      console.error('err', err);
    }
  });
});
