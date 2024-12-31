/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity({
    schema: "public",
    name: "account"
})
export class Account{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    account_code:string;

    @Column()
    account_name:string;
    
    @Column()
    account_type:string;

    @Column()
    parent_account_id:number;

    @Column()
    account_balance:string;

    @Column()
    is_active:number;

    @Column()
    currency_code:string;

    @Column()
    is_system_generated:number;

    @Column()
    remarks:string;

    @Column()
    created_at:Date;

    @Column()
    deleted:Date;

    @Column()
    updated_at:Date;
}