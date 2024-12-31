/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity("routing_permission")
export class RoutingPermission{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    routing_header:number;

    @Column()
    menu:number;

    @Column()
    prev_state:string;

    @Column()
    state:string;

    @Column()
    users:number;

    @Column()
    is_active:number;

    @Column()
    created_at:Date;

    @Column()
    deleted:Date;

    @Column()
    updated_at:Date;
}