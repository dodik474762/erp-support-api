/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TestQuestionItem } from './test_question_item.entity';
import { CandidateScheduleTestAnswer } from './candidate_schedule_test_answer.entity';
import { TestSub } from './test_sub.entity';
import { CandidateScheduleTestSubPicture } from './candidate_schedule_test_sub_picture.entity';

@Entity('candidate_schedule_test_sub')
export class CandidateScheduleTestSub {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  job: number;

  @Column()
  candidate: number;

  @Column()
  candidate_test: number;

  @Column()
  test: number;

  @Column()
  test_sub: number;

  @Column()
  nama_candidate: string;

  @Column()
  code: string;

  @Column()
  remarks: string;

  @Column()
  date_schedule: Date;

  @Column()
  start_date_schedule: Date;

  @Column()
  end_date_schedule: Date;

  @Column()
  current_date_schedule: Date;

  @Column()
  job_schedule: number;

  @Column()
  status: string;

  @Column()
  poin: number;

  @Column()
  created_at: Date;

  @Column()
  deleted: Date;

  @Column()
  updated_at: Date;

  @OneToMany(
    () => CandidateScheduleTestAnswer,
    (model) => model.candidate_sub_tests,
  )
  @JoinColumn({ name: 'id' })
  answers: CandidateScheduleTestAnswer[];

  @OneToOne(() => TestSub, (model) => model.id)
  @JoinColumn({ name: 'test_sub' })
  subtest: TestSub;

  @OneToMany(
    () => CandidateScheduleTestSubPicture,
    (model) => model.candidate_sub_tests,
  )
  @JoinColumn({ name: 'id' })
  pictures: CandidateScheduleTestSubPicture[];
  
}
