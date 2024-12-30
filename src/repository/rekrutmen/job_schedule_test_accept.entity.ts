
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Test } from "./test.entity";


@Entity("job_schedule_test_accept")
export class JobScheduleTestAccept{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    job_schedule_test:number;
   
    @Column()
    is_active:number;
    
    @Column()
    job:number;
   
    @Column()
    judul:string;
    
    @Column()
    test:number;
    
    @Column()
    remarks:string;

    @Column()
    created_at:Date;

    @Column()
    deleted:Date;

    @Column()
    updated_at:Date;

    @OneToOne(type => Test, test => test.id)
    @JoinColumn({ name: "test" })
    test_item: Test
}