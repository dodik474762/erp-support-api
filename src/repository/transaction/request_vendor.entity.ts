/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity("vendor")
export class Vendor{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    users:number;

    @Column()
    code:string;

    @Column()
    vendor_name:string;

    @Column()
    vendor_category:number;

    @Column()
    address:string;

    @Column()
    email:string;

    @Column()
    web:string;

    @Column()
    phone:string;

    @Column()
    vendor_type:string;

    @Column()
    pic_name:string;

    @Column()
    pic_contact:string;

    @Column()
    pic_title:string;

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

    @Column()
    status:string;

    @Column()
    subsidiary:number;

    @Column()
    vendor_erp_id:string;

    @Column()
    vendor_erp_name:string;

    @Column()
    vendor_erp_code:string;
}