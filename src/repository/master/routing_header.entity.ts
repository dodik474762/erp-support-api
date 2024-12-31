/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity("routing_header")
export class RoutingHeader{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    menu:number;

    @Column()
    remarks:string;

    @Column()
    created_at:Date;

    @Column()
    deleted:Date;

    @Column()
    updated_at:Date;
}