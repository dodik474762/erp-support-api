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
import { TestQuestionItem } from './test_question_item.entity';
import { TestQuestionDescItem } from '../master/test_question_desc_item.entity';
import { TestAnswerDescribe } from '../master/test_answer_describe.entity';

@Entity('candidate_schedule_test_answer')
export class CandidateScheduleTestAnswer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  candidate_schedule_test: number;

  @Column()
  candidate_schedule_test_sub: number;

  @Column()
  test: number;

  @Column()
  test_sub: number;

  @Column()
  answer: string;

  @Column()
  nama_candidate: string;

  @Column()
  poin: number;

  @Column()
  remarks: string;

  @Column()
  right_answer: string;
  
  @Column()
  most: string;
  
  @Column()
  least: string;

  @Column()
  questions_item: number;

  @Column()
  created_at: Date;

  @Column()
  deleted: Date;

  @Column()
  updated_at: Date;

  @ManyToOne(() => CandidateScheduleTestSub, (model) => model.id)
  @JoinColumn({ name: 'candidate_schedule_test_sub' })
  candidate_sub_tests: CandidateScheduleTestSub;

  @OneToOne(() => TestQuestionItem, (model) => model.id)
  @JoinColumn({ name: 'questions_item' })
  questions: TestQuestionItem[];
  
  @OneToOne(() => TestQuestionDescItem, (model) => model.id)
  @JoinColumn({ name: 'questions_item' })
  questions_describes: TestQuestionDescItem[];
}
