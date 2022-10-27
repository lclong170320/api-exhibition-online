import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Booth } from './booth.entity';
import { Space } from './space.entity';

@Entity({ name: 'location-status' })
export class LocationStatus {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    name: string;

    @Column({ name: 'position_x', length: 255 })
    positionX: string;

    @Column({ name: 'position_y', length: 255 })
    positionY: string;

    @Column({ name: 'position_z', length: 255 })
    positionZ: string;

    @Column({ name: 'rotation_x', length: 255 })
    rotationX: string;

    @Column({ name: 'rotation_y', length: 255 })
    rotationY: string;

    @Column({ name: 'rotation_z', length: 255 })
    rotationZ: string;

    @Column({ name: 'is_registered' })
    isRegistered: boolean;

    @Column({ name: 'user_id' })
    userId: number;

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

    @OneToOne(() => Booth, (booth) => booth.locationStatus, {
        nullable: false,
    })
    booth: Booth;

    @ManyToOne(() => Space, (space) => space.locationStatus, {
        nullable: false,
    })
    @JoinColumn({
        name: 'space_id',
        foreignKeyConstraintName: 'fk-space_location-status',
    })
    space: Space;
}
