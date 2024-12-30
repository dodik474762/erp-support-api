
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity("norma_test_cfit")
export class NormaTestCfit{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    poin:number;
    
    @Column()
    iq_value:number;

    @Column()
    created_at:Date;

    @Column()
    deleted:Date;

    @Column()
    updated_at:Date;
}