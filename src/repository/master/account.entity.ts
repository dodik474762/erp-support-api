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
    code:string;

    @Column()
    name:string;
    
    @Column()
    context:string;

    @Column()
    created_at:Date;

    @Column()
    deleted:Date;

    @Column()
    updated_at:Date;
}