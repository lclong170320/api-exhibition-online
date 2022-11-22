import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Booth } from './booth.entity';

@Entity({ name: 'booking' })
export class Booking {
    // table columns
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    name: string;

    @Column({ length: 255 })
    phone: string;

    @Column({ type: 'datetime' })
    time: Date;

    @Column({ length: 255 })
    notes: string;

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

    // relations columns
    @ManyToOne(() => Booth, (booth) => booth.booking)
    @JoinColumn({
        name: 'booth_id',
    })
    booth: Booth;
}
