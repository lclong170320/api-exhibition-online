import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Column,
    OneToMany,
} from 'typeorm';
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
}
