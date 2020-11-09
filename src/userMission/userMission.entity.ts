import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Mission } from '../mission/mission.entity';

@Entity()
export class UserMission {
  @PrimaryGeneratedColumn()
  public userMissionId!: number;

  @Column()
  public userId!: number;

  @Column()
  public missionId!: number;

  @Column()
  public status: string;

  @ManyToOne((type) => User, (user) => user.userMissions)
  public user!: User;

  @ManyToOne((type) => Mission, (mission) => mission.userMissions)
  public mission!: Mission;
}
