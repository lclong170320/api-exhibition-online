import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Column,
    OneToMany,
    ManyToMany,
} from 'typeorm';
import { Booth } from './booth.entity';
import { Exhibition } from './exhibition.entity';
import { PositionBooth } from './position-booth.entity';

@Entity({ name: 'booth_templates' })
export class BoothTemplate {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'name' })
    name: string;

    @Column({ name: 'media_id' })
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

    @OneToMany(() => Booth, (booth) => booth.boothTemplate)
    booths: Booth[];

    @OneToMany(() => PositionBooth, (position) => position.boothTemplate)
    positionBooth: PositionBooth[];

    @ManyToMany(() => Exhibition)
    exhibitions: Exhibition[];
}
