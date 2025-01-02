/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity("request_item")
export class RequestItem{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    users:number;

    @Column()
    code:string;

    @Column()
    item_name:string;

    @Column()
    item_code:string;

    @Column()
    departemen:number;

    @Column()
    departemen_name:string;

    @Column()
    locations:number;

    @Column()
    locations_name:string;

    @Column()
    account:number;

    @Column()
    account_name:string;

    @Column()
    item_erp_code:string;

    @Column()
    item_erp_name:string;

    @Column()
    item_erp_id:string;

    @Column()
    remarks:string;

    @Column()
    acc_by:number;

    @Column()
    acc_remarks:string;

    @Column()
    next_acc:number;

    @Column()
    current_step_acc:string;

    @Column()
    total_rejected:number;

    @Column()
    created_at:Date;

    @Column()
    deleted:Date;

    @Column()
    updated_at:Date;
}