/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity("test_sub")
export class TestSub{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    test:number;
    
    @Column()
    judul:string;

    @Column()
    category:string;
    
    @Column()
    remarks:string;
    
    @Column()
    timetest:number;

    @Column()
    created_at:Date;

    @Column()
    deleted:Date;

    @Column()
    updated_at:Date;
}