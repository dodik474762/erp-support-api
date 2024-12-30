/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity("company")
export class Company{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    code:string;

    @Column()
    nama:string;
    
    @Column()
    alamat:string;

    @Column()
    contact:string;

    @Column()
    email:string;

    @Column()
    created_at:Date;

    @Column()
    deleted:Date;

    @Column()
    updated_at:Date;
}