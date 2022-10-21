import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Exhibition } from './exhibition.entity';
import { PositionSpace } from './position-space.entity';
import { Space } from './space.entity';

@Entity({ name: 'space_templates' })
export class SpaceTemplate {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'name' })
    name: string;

    @Column({ name: 'model_id' })
    modelId: number;

    @Column({ name: 'thumbnail_id' })
    thumbnailId: number;

    @Column({ name: 'exhibition_map_id' })
    exhibitionMapId: number;

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

    @OneToMany(() => Space, (space) => space.spaceTemplate)
    spaces: Space[];

    @OneToMany(
        () => PositionSpace,
        (positionSpace) => positionSpace.spaceTemplate,
    )
    positionSpaces: PositionSpace[];

    @OneToMany(() => Exhibition, (exhibition) => exhibition.spaceTemplate)
    exhibitions: Exhibition[];
}
