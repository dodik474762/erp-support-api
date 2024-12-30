/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity("permission_users")
export class PermissionUsers{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    menu:number;
    
    @Column()
    menu_code:string;
    
    @Column()
    user_group:number;
    
    @Column()
    action:string;

    @Column()
    created_at:Date;

    @Column()
    deleted:Date;

    @Column()
    updated_at:Date;
}