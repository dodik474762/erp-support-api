/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity("employee")
export class Employee{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    employee_code:string;

    @Column()
    name:string;
    
    @Column()
    address:string;
    
    @Column()
    job_title:number;

    @Column()
    created_at:Date;

    @Column()
    deleted:Date;

    @Column()
    updated_at:Date;
}