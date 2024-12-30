/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CandidateSummaryDescribe } from "./candidate_summary_desc.entity";


@Entity("candidate_summary")
export class CandidateSummary{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    candidate_applied:number;

    @Column()
    file_test_desc:string;
    
    @Column()
    path_file_test_desc:string;
    
    @Column()
    remarks:string;
    
    @Column()
    result:string;    

    @Column()
    created_at:Date;

    @Column()
    deleted:Date;

    @Column()
    updated_at:Date;

    @OneToMany(() => CandidateSummaryDescribe, model => model.candidate_summarys)
    @JoinColumn({name: "id"})
    candidates_describes: CandidateSummaryDescribe[];
}