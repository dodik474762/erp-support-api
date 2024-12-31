/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity("department")
export class Department{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    code:string;

    @Column()
    department_name:string;
    
    @Column()
    remarks:string;    

    @Column()
    created_at:Date;

    @Column()
    deleted:Date;

    @Column()
    updated_at:Date;
}