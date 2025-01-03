/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity("document_transaction")
export class DocumentTransaction{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    no_document:string;

    @Column()
    actors:number;
    
    @Column()
    state:string;
    
    @Column()
    remarks:string;

    @Column()
    created_at:Date;

    @Column()
    deleted:Date;

    @Column()
    updated_at:Date;    
}