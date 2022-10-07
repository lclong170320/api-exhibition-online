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

@Entity({ name: 'booth_datas' })
export class BoothData {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'media_id', nullable: true })
    mediaId: number;

    @Column({ length: 255, nullable: true })
    title: string;

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

    @ManyToOne(() => Booth, (both) => both.boothDatas, { nullable: false })
    @JoinColumn({
        name: 'booth_id',
        foreignKeyConstraintName: 'fk-booth_datas-booths',
    })
    booth: Booth;

    @ManyToOne(() => PositionBooth, (position) => position.boothDatas, {
        nullable: false,
    })
    @JoinColumn({
        name: 'position_booth_id',
        foreignKeyConstraintName: 'fk-booth_datas-position_booths',
    })
    positionBooth: PositionBooth;
}
