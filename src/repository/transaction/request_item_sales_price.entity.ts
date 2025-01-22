/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity("request_item_sales_price")
export class RequestItemSalesPrice{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    request_item:number;

    @Column()
    type_price:number;

    @Column()
    price:string;

    @Column()
    created_at:Date;

    @Column()
    deleted:Date;

    @Column()
    updated_at:Date;
}