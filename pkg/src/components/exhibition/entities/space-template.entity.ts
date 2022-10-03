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

    @OneToMany(() => Space, (space) => space.spaceTemplate)
    spaces: Space[];

    @OneToMany(
        () => PositionSpace,
        (positionSpace) => positionSpace.spaceTemplate,
    )
    positionSpaces: PositionSpace[];
}
