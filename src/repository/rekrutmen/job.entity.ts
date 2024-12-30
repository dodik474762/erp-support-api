
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity("job")
export class Job{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    nama_job:string;
    
    @Column()
    placement:string;
    
    @Column()
    remarks:string;
    
    @Column()
    company:number;

    @Column()
    created_at:Date;

    @Column()
    deleted:Date;

    @Column()
    updated_at:Date;
}