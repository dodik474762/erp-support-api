/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity({
    schema: "public",
    name: "activity_log",
})
export class ActivityLog{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    users:number;
    
    @Column()
    action:string;

    @Column()
    table_db:string;
    
    @Column()
    remarks:string;

    @Column()
    account_code:string;

    @Column()
    account:number;

    @Column()
    reference_id:number;

    @Column()
    created_at:Date;

    @Column()
    deleted:Date;

    @Column()
    updated_at:Date;
}