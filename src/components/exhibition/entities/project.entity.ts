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
import { PositionBooth } from './position-booth.entity';

@Entity({ name: 'projects' })
export class Project {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'media_id', nullable: true })
    mediaId: number;

    @Column({ length: 255, nullable: true })
    title: string;

    @Column({ type: 'longtext', nullable: true })
    description: string;

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

    @ManyToOne(() => Booth, (booth) => booth.projects, {
        nullable: false,
    })
    @JoinColumn({
        name: 'booth_id',
        foreignKeyConstraintName: 'fk-project-booth',
    })
    booth: Booth;

    @ManyToOne(() => PositionBooth, (positionBooth) => positionBooth.projects, {
        nullable: false,
    })
    @JoinColumn({
        name: 'position_booth_id',
        foreignKeyConstraintName: 'fk-projects-position_booths',
    })
    positionBooth: PositionBooth;
}
