import {
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Image } from './image.entity';
import { SpaceTemplatePosition } from './space-template-position.entity';
import { Space } from './space.entity';

@Entity({ name: 'space_image' })
export class SpaceImage {
    // table columns
    @PrimaryGeneratedColumn()
    id: number;

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
    @ManyToOne(() => Space, (space) => space.spaceImages, {
        nullable: false,
    })
    @JoinColumn({
        name: 'space_id',
    })
    space: Space;

    @ManyToOne(
        () => SpaceTemplatePosition,
        (spaceTemplatePosition) => spaceTemplatePosition.spaceImages,
        {
            nullable: false,
        },
    )
    @JoinColumn({
        name: 'space_template_position_id',
    })
    spaceTemplatePosition: SpaceTemplatePosition;

    @ManyToOne(() => Image, (image) => image.spaceImages)
    @JoinColumn({
        name: 'image_id',
    })
    image: Image;
}
