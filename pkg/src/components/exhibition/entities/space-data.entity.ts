import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { PositionSpace } from './position-space.entity';
import { Space } from './space.entity';

@Entity({ name: 'space_datas' })
export class SpaceData {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'media_id', nullable: true })
    mediaId: number;

    @Column({ nullable: true })
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

    @ManyToOne(() => Space, (space) => space.spaceDatas, {
        nullable: false,
    })
    @JoinColumn({
        name: 'space_id',
        foreignKeyConstraintName: 'fk-space_datas-spaces',
    })
    space: Space;

    @ManyToOne(() => PositionSpace, (position) => position.spaceDatas, {
        nullable: false,
    })
    @JoinColumn({
        name: 'position_space_id',
        foreignKeyConstraintName: 'fk-space_datas-position_space',
    })
    positionSpace: PositionSpace;
}
