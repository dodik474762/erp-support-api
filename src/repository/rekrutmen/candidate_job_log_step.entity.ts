/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity("candidate_job_log_step")
export class CandidateJobLogStep{
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