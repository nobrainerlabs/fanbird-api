import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '../app.module';
import { MissionService } from '../mission/mission.service';
import { UserService } from '../user/user.service';

describe('Mock initial data', () => {
  let userService: UserService;
  let missionService: MissionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    userService = module.get<UserService>(UserService);
    missionService = module.get<MissionService>(MissionService);
  });

  it('should create user', async () => {
    const users = [
      { email: 'user@test.com', password: 'asdfasdf' },
      { email: 'user2@test.com', password: 'asdfasdf' },
    ];
    try {
      for (const user of users) {
        // const newUser = await userService.create(user);
      }
    } catch (err) {
      console.error('error', err);
    }
  });

  it('should create brands', async () => {
    const { missions } = require('./samples/brands');

    try {
      for (const mission of missions) {
        const newMission = await missionService.create(mission);
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
});
