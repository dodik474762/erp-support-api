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

    @Column()
    status:string;

    @Column()
    subsidiary:number;
    
    @Column()
    primary_unit:number;

    @Column()
    primary_stock_unit:number;

    @Column()
    primary_purchase_unit:number;

    @Column()
    primary_sale_unit:number;

    @Column()
    primary_consumtion_unit:number;

    @Column()
    volume_type:number;

    @Column()
    incubation_days:string;

    @Column()
    costing_method:number;

    @Column()
    cost_category:number;

    @Column()
    purchase_price:string;

    @Column()
    planning_item_category:number;

    @Column()
    replanisment_method:number;

    @Column()
    tax_schedule:number;

    @Column()
    product_type:number;

    @Column()
    generate_accrual:number;

    @Column()
    group_type:number;

    @Column()
    auto_calculate:number;

    @Column()
    item_category:number;
}