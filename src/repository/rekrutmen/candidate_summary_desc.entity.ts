/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CandidateSummary } from "./candidate_summary.entity";


@Entity("candidate_summary_describe")
export class CandidateSummaryDescribe{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    candidate_summary:number;

    @Column()
    code:string;
    
    @Column()
    name:string;
    
    @Column()
    remarks:string;    

    @Column()
    created_at:Date;

    @Column()
    deleted:Date;

    @Column()
    updated_at:Date;

    @ManyToOne(type => CandidateSummary, candidate_summary => candidate_summary.id)
    @JoinColumn({ name: "candidate_summary" })
    candidate_summarys: CandidateSummary;
}