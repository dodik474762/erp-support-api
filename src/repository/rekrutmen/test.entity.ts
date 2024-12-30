/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity("test")
export class Test{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    judul:string;

    @Column()
    category:string;
    
    @Column()
    remarks:string;
    
    @Column()
    ordering_test:number;

    @Column()
    created_at:Date;

    @Column()
    deleted:Date;

    @Column()
    updated_at:Date;
}