import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Pano } from './pano.entity';

@Entity({ name: 'markers' })
export class Marker {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'int',
        name: 'media_id',
    })
    mediaId: number;

    @Column({ type: 'int', name: 'position_x' })
    positionX: number;

    @Column({ type: 'int', name: 'position_y' })
    positionY: number;

    @Column({ type: 'int', name: 'position_z' })
    positionZ: number;

    @Column({ length: 255 })
    destination: string;

    @Column({ length: 255 })
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

    @ManyToOne(() => Pano, (pano) => pano.markers, { nullable: false })
    @JoinColumn({
        name: 'pano_id',
        foreignKeyConstraintName: 'fk_pano_markers',
    })
    pano: Pano;
}
