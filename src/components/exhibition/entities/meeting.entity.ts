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

@Entity({ name: 'meeting' })
export class Meeting {
    // table columns
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'customer_name', length: 255 })
    customerName: string;

    @Column()
    phone: string;

    @Column()
    email: string;

    @Column({
        type: 'timestamp',
        name: 'start_time',
    })
    startTime: Date;
    @Column({
        type: 'timestamp',
        name: 'end_time',
    })
    endTime: Date;

    @Column({ length: 255 })
    note: string;

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

    // relation columns
    @ManyToOne(() => Booth, (booth) => booth.meetings)
    @JoinColumn({ name: 'booth_id' })
    booth: Booth;
}
