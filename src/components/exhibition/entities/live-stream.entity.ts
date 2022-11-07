import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Booth } from './booth.entity';

@Entity({ name: 'livestreams' })
export class LiveStream {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    link: string;

    @Column({ type: 'datetime' })
    date: Date;

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

    @ManyToOne(() => Booth, (booth) => booth.liveStreams, {
        nullable: false,
    })
    @JoinColumn({
        name: 'booth_id',
        foreignKeyConstraintName: 'fk-livestreams-booth',
    })
    booth: Booth;
}
