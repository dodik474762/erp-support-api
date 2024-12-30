/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { TestAnswer } from "./test_answer.entity";
import { CandidateScheduleTestSub } from "./candidate_schedule_test_sub.entity";


@Entity("test_question_item")
export class TestQuestionItem{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    test:number;
    
    @Column()
    test_sub:number;

    @Column()
    questions:string;

    @Column()
    file_questions:string;
    
    @Column()
    path_file:string;
    
    @Column()
    right_answer:string;
    
    @Column()
    type:string;
    
    @Column()
    remarks:string;
    
    @Column()
    multi_answer:number;

    @Column()
    created_at:Date;

    @Column()
    deleted:Date;

    @Column()
    updated_at:Date;

    @OneToMany(() => TestAnswer, model => model.questions)
    @JoinColumn({ name: "id" })
    answers: TestAnswer[]

}