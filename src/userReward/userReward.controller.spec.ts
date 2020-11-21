import { Test, TestingModule } from '@nestjs/testing';
import { UserRewardController } from './userReward.controller';

describe('UserReward Controller', () => {
  let controller: UserRewardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserRewardController],
    }).compile();

    controller = module.get<UserRewardController>(UserRewardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
