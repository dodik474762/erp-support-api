/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
  } from 'typeorm';
import { TestQuestionDescItem } from './test_question_desc_item.entity';
  
  @Entity('test_answer_describe')
  export class TestAnswerDescribe {
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
    most: string;
    
    @Column()
    least: string;
    
    @Column()
    is_right: number;
  
    @Column()
    created_at: Date;
  
    @Column()
    deleted: Date;
  
    @Column()
    updated_at: Date;
  
    @ManyToOne(() => TestQuestionDescItem, (model) => model.id)
    @JoinColumn({ name: 'test_question' })
    questions: TestQuestionDescItem;
  }
  