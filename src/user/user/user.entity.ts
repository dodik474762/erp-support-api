/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity("users")
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nik: string;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column({ type: "timestamp" })
    created_at: Date;

    @Column({ type: "timestamp" })
    deleted: Date;

    @Column({ type: "timestamp" })
    updated_at: Date;

    @Column()
    roles: number;
}