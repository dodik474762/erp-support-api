/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { TestAnswerDescribe } from "./test_answer_describe.entity";


@Entity("test_question_desc_item")
export class TestQuestionDescItem{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    test:number;
    
    @Column()
    test_sub:number;

    @Column()
    questions:string;
    
    @Column()
    describes:string;
    
    @Column()
    type:string;
    
    @Column()
    remarks:string;
    
    @Column()
    most: string;
    
    @Column()
    least: string;

    @Column()
    created_at:Date;

    @Column()
    deleted:Date;

    @Column()
    updated_at:Date;

    @OneToMany(() => TestAnswerDescribe, model => model.questions)
    @JoinColumn({ name: "id" })
    answers: TestAnswerDescribe[]

}