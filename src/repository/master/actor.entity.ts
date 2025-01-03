/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity("actors")
export class Actors{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    users:number;

    @Column()
    latitude:string;
    
    @Column()
    longitude:string;
    
    @Column()
    content:string;
    
    @Column()
    action:string;

    @Column()
    remarks:string;

    @Column()
    created_at:Date;

    @Column()
    updated_at:Date;
}