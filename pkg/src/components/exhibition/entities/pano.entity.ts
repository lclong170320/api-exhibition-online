import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
    JoinColumn,
} from 'typeorm';
import { Exhibition } from './exhibition.entity';
import { Marker } from './marker.entity';

@Entity({ name: 'panos' })
export class Pano {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'int',
        name: 'media_id',
    })
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

    @ManyToOne(() => Exhibition, (exhibition) => exhibition.panos, {
        nullable: false,
    })
    @JoinColumn({
        name: 'exhibition_id',
        foreignKeyConstraintName: 'fk_exhibition_panos',
    })
    exhibition: Exhibition;

    @OneToMany(() => Marker, (marker) => marker.pano)
    markers: Marker[];
}
