import { MissionService } from './../mission/mission.service';
import { UserService } from './../user/user.service';
import { missions } from './samples/missions';

export class MockService {
  constructor(
    private userService: UserService,
    private missionService: MissionService,
  ) {}

  async mockUsers() {
    console.log('runnign micok users');
    const users = [
      { email: 'user@test.com', password: 'asdfasdf' },
      { email: 'user2@test.com', password: 'asdfasdf' },
    ];
    for (const user of users) {
      try {
        const newUser = await this.userService.create(user);
        console.log('new user', newUser);
      } catch (err) {
        console.error('some error', err);
      }
    }
  }

  async mockMissions() {
    for (const mission of missions) {
      try {
        const newMission = await this.missionService.create(mission);
        console.log('new mission', newMission);
      } catch (err) {
        console.error('err', err);
      }
    }
  }
}
