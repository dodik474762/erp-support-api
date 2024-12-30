/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity("menu")
export class Menu{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    menu_code:string;

    @Column()
    name:string;
    
    @Column()
    icon:string;
    
    @Column()
    path:string;
    
    @Column()
    parent:string;

    @Column()
    created_at:Date;

    @Column()
    deleted:Date;

    @Column()
    updated_at:Date;
}