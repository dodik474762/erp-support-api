/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity("product_type")
export class ProductType{
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