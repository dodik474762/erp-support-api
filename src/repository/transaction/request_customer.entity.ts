/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity("customer")
export class Customer{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    users:number;

    @Column()
    code:string;

    @Column()
    customer_name:string;

    @Column()
    customer_category:number;

    @Column()
    address:string;

    @Column()
    email:string;

    @Column()
    web:string;

    @Column()
    phone:string;

    @Column()
    customer_type:string;

    @Column()
    pic_name:string;

    @Column()
    pic_contact:string;

    @Column()
    pic_title:string;

    @Column()
    date_permit_valid_start_date:Date;

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
    date_permit_valid_end_date:Date;

    @Column()
    date_certificate_cdob_start_date:Date;

    @Column()
    date_certificate_cdob_end_date:Date;

    @Column()
    date_permit_apoteker_start_date:Date;

    @Column()
    date_permit_apoteker_end_date:Date;

    @Column()
    date_certificate_cdakb_start_date:Date;

    @Column()
    date_certificate_cdakb_end_date:Date;

    @Column()
    permit_number:string;

    @Column()
    cdob_number:string;

    @Column()
    apoteker_number:string;

    @Column()
    cdakb_number:string;

    @Column()
    customer_erp_id:string;

    @Column()
    customer_erp_name:string;

    @Column()
    customer_erp_code:string;
}