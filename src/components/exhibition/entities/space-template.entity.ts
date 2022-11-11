import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { SpaceTemplatePosition } from './space-template-position.entity';
import { Space } from './space.entity';
import { SpaceTemplateLocation } from './space-template-location.entity';

@Entity({ name: 'space_template' })
export class SpaceTemplate {
    // table columns
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'name' })
    name: string;

    @Column({ name: 'created_by' })
    createdBy: number;

    @Column({ name: 'model_id' })
    modelId: number;

    @Column({ name: 'thumbnail_id' })
    thumbnailId: number;

    @Column({ name: 'map_id' })
    mapId: number;

    @Column({ type: 'datetime', name: 'created_date' })
    createdDate: Date;

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

    // relation columns
    @OneToMany(() => Space, (space) => space.spaceTemplate)
    spaces: Space[];

    @OneToMany(
        () => SpaceTemplatePosition,
        (spaceTemplatePosition) => spaceTemplatePosition.spaceTemplate,
    )
    spaceTemplatePositions: SpaceTemplatePosition[];

    @OneToMany(
        () => SpaceTemplateLocation,
        (spaceTemplateLocation) => spaceTemplateLocation.spaceTemplate,
    )
    spaceTemplateLocations: SpaceTemplateLocation[];
}
