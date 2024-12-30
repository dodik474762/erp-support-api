/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity("candidate_applied")
export class CandidateApplied{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    job:number;

    @Column()
    candidate:number;
    
    @Column()
    nama_candidate:string;
    
    @Column()
    date_applied:Date;
    
    @Column()
    remarks:string;    

    @Column()
    created_at:Date;

    @Column()
    deleted:Date;

    @Column()
    updated_at:Date;
}