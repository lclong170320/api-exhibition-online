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

@Entity({ name: 'booth_data' })
export class BoothData {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'media_id', nullable: true })
    mediaId: number;

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

    @ManyToOne(() => Booth, (booth) => booth.boothData, {
        nullable: false,
    })
    @JoinColumn({
        name: 'booth_id',
        foreignKeyConstraintName: 'fk-booth_data-booth',
    })
    booth: Booth;

    @ManyToOne(
        () => PositionBooth,
        (positionBooth) => positionBooth.boothData,
        {
            nullable: false,
        },
    )
    @JoinColumn({
        name: 'position_booth_id',
        foreignKeyConstraintName: 'fk-booth_data-position_booths',
    })
    positionBooth: PositionBooth;
}
