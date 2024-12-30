/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CandidateScheduleTestSub } from './candidate_schedule_test_sub.entity';

@Entity('candidate_schedule_test_sub_picture')
export class CandidateScheduleTestSubPicture {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  candidate_schedule_test: number;

  @Column()
  candidate_schedule_test_sub: number;

  @Column()
  file: string;

  @Column()
  path_file: string;

  @Column()
  created_at: Date;

  @Column()
  deleted: Date;

  @Column()
  updated_at: Date;

  @ManyToOne(() => CandidateScheduleTestSub, (model) => model.id)
  @JoinColumn({ name: 'candidate_schedule_test_sub' })
  candidate_sub_tests: CandidateScheduleTestSub;
}
