import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Column,
    DeleteDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Exhibition } from './exhibition.entity';

export enum Status {
    NEW = 'new',
    ACCEPTED = 'accepted',
    REFUSED = 'refused',
}

@Entity({ name: 'registration' })
export class Registration {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    name: string;

    @Column({ length: 15 })
    phone: string;

    @Column({ length: 255 })
    email: string;

    @Column({ length: 255 })
    address: string;

    @Column({ type: 'longtext', nullable: true })
    note: string;

    @Column({
        type: 'enum',
        enum: Status,
        default: Status.NEW,
    })
    status: Status;

    @CreateDateColumn({
        type: 'timestamp',
        name: 'created_at',
    })
    createdAt: Date;

    @UpdateDateColumn({
        type: 'timestamp',
        name: 'updated_at',
    })
    updatedAt: Date;

    @DeleteDateColumn({
        type: 'timestamp',
        name: 'deleted_at',
        nullable: true,
    })
    deletedAt: Date;

    @ManyToOne(() => Exhibition, (exhibition) => exhibition.registrations)
    @JoinColumn({
        name: 'exhibition_id',
    })
    exhibition: Exhibition;
}
