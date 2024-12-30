/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity("candidate")
export class Candidate{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    nik:string;

    @Column()
    alamat:string;
    
    @Column()
    nama_lengkap:string;
    
    @Column()
    contact:string;
    
    @Column()
    email:string;
    
    @Column()
    gender:string;
    
    @Column()
    pas_foto:string;
    
    @Column()
    path_file:string;
    
    @Column()
    date_born:Date;
    
    @Column()
    place_born:string;
    
    @Column()
    last_study:string;
    
    @Column()
    last_study_remarks:string;

    @Column()
    created_at:Date;

    @Column()
    deleted:Date;

    @Column()
    updated_at:Date;
}