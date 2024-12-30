/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity("job_title")
export class JobTitle{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    job_title_code:string;

    @Column()
    job_name:string;

    @Column()
    created_at:Date;

    @Column()
    deleted:Date;

    @Column()
    updated_at:Date;
}