import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Column,
    ManyToOne,
    JoinColumn,
    DeleteDateColumn,
} from 'typeorm';
import { Booth } from './booth.entity';

@Entity({ name: 'live_stream' })
export class LiveStream {
    // table columns
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    link: string;

    @Column({ type: 'datetime' })
    time: Date;

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
    @ManyToOne(() => Booth, (booth) => booth.liveStreams, {
        nullable: false,
    })
    @JoinColumn({
        name: 'booth_id',
    })
    booth: Booth;
}
