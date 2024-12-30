/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity("candidate_job_step")
export class CandidateJobStep{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    candidate:number;

    @Column()
    job:number;
    
    @Column()
    step:string;
    
    @Column()
    candidate_applied:number;

    @Column()
    created_at:Date;

    @Column()
    deleted:Date;

    @Column()
    updated_at:Date;
}