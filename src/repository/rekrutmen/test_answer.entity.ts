/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TestQuestionItem } from './test_question_item.entity';

@Entity('test_answer')
export class TestAnswer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  test: number;

  @Column()
  test_sub: number;

  @Column()
  test_question: number;

  @Column()
  answer: string;

  @Column()
  type: string;

  @Column()
  file: string;

  @Column()
  file_path: string;

  @Column()
  remarks: string;
  
  @Column()
  is_right: number;

  @Column()
  created_at: Date;

  @Column()
  deleted: Date;

  @Column()
  updated_at: Date;

  @ManyToOne(() => TestQuestionItem, (model) => model.id)
  @JoinColumn({ name: 'test_question' })
  questions: TestQuestionItem;
}
