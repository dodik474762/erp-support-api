/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity("users_group")
export class Roles{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    roles_code:string;

    @Column()
    roles_name:string;

    @Column()
    created_at:Date;

    @Column()
    deleted:Date;

    @Column()
    updated_at:Date;
}