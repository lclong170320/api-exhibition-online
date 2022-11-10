import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Booth } from './booth.entity';
import { SpaceTemplateLocation } from './space-template-location.entity';
import { Space } from './space.entity';

export enum Status {
    AVAILABLE = 'available',
    RESERVED = 'reserved',
}

@Entity({ name: 'location' })
export class Location {
    // table columns
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'enum',
        enum: Status,
        default: Status.AVAILABLE,
    })
    status: Status;

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

    // relations columns
    @ManyToOne(() => Space, (space) => space.locations, {
        nullable: false,
    })
    @JoinColumn({
        name: 'space_id',
    })
    space: Space;

    @ManyToOne(
        () => SpaceTemplateLocation,
        (spaceTemplateLocation) => spaceTemplateLocation.locations,
    )
    @JoinColumn({
        name: 'space_template_location_id',
    })
    spaceTemplateLocation: SpaceTemplateLocation;

    @OneToOne(() => Booth, (booth) => booth.location, {
        nullable: false,
    })
    booth: Booth;
}
