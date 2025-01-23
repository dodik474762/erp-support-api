/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity("customer_category")
export class CustomerCategory{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    type:string;

    @Column()
    remarks:string;

    @Column()
    created_at:Date;

    @Column()
    deleted:Date;

    @Column()
    updated_at:Date;
}