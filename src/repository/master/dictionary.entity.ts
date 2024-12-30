/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity("dictionary")
export class Dictionary{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    term_id:string;

    @Column()
    keterangan:string;
    
    @Column()
    context:string;

    @Column()
    created_at:Date;

    @Column()
    deleted:Date;

    @Column()
    updated_at:Date;
}