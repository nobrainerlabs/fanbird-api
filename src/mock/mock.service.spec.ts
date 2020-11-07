import { MockService } from './mock.service';
import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '../app.module';
import { MissionService } from '../mission/mission.service';
import { UserService } from '../user/user.service';

describe('Mock initial data', () => {
  let userService: UserService;
  let missionService: MissionService;
  let mockService: MockService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    userService = module.get<UserService>(UserService);
    missionService = module.get<MissionService>(MissionService);
    mockService = module.get<MockService>(MockService);
  });

  it('should create user', async () => {
    await mockService.mockUsers();
  });

  it('should create missions', async () => {
    await mockService.mockMissions();
  });
});
