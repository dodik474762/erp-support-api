
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity("job_schedule_test")
export class JobScheduleTest{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    job:number;
    
    @Column()
    remarks:string;
    
    @Column()
    type_ist_test:number;
    
    @CreateDateColumn({type: "time without time zone"})
    start_date:Date;
    
    @Column()
    end_date:Date;

    @Column()
    created_at:Date;

    @Column()
    deleted:Date;

    @Column()
    updated_at:Date;
}