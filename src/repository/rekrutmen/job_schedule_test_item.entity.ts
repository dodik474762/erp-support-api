
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity("job_schedule_test_item")
export class JobScheduleTestItem{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    job:number;
    
    @Column()
    test:number;
    
    @Column()
    remarks:string;
    
    @Column()
    job_schedule_test:number;

    @Column()
    created_at:Date;

    @Column()
    deleted:Date;

    @Column()
    updated_at:Date;
}