/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Test } from './test.entity';

@Entity('candidate_schedule_test')
export class CandidateScheduleTest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  job: number;

  @Column()
  candidate: number;

  @Column()
  test: number;

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

  @OneToOne(() => Test, (model) => model.id)
  @JoinColumn({ name: 'test' })
  test_category: Test;
}
