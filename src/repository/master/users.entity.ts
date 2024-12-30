/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity("users")
export class Users{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    nik:string;
    
    @Column()
    employee_code:string;

    @ApiProperty()
    @Column()
    username:string;

    @Column()
    name:string;
    
    @ApiProperty()
    @Column()
    password:string;
    
    @Column()
    user_group:number;

    @Column()
    created_at:Date;

    @Column()
    deleted:Date;

    @Column()
    updated_at:Date;
}