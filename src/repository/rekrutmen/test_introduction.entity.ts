/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity("test_introduction")
export class TestIntroduction{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    test:number;
    
    @Column()
    test_sub:number;

    @Column()
    file:string;

    @Column()
    file_path:string;
    
    @Column()
    remarks:string;
    
    @Column()
    timetest:number;
    
    @Column()
    type:string;

    @Column()
    created_at:Date;

    @Column()
    deleted:Date;

    @Column()
    updated_at:Date;
}