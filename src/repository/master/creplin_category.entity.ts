/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity("creplin_category")
export class CreplinCategory{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    category:string;

    @Column()
    term_category:string;
    
    @Column()
    poin_sma_ipa:string;
    
    @Column()
    poin_sma_ips:string;
    
    @Column()
    poin_s1_ipa:string;
    
    @Column()
    poin_s1_ips:string;

    @Column()
    created_at:Date;

    @Column()
    deleted:Date;

    @Column()
    updated_at:Date;
}