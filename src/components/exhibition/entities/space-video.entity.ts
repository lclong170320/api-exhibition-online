import {
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { SpaceTemplatePosition } from './space-template-position.entity';
import { Space } from './space.entity';
import { Video } from './video.entity';

@Entity({ name: 'space_video' })
export class SpaceVideo {
    // tables column
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

    // relations column
    @ManyToOne(() => Space, (space) => space.spaceVideos, {
        nullable: false,
    })
    @JoinColumn({
        name: 'space_id',
    })
    space: Space;

    @ManyToOne(
        () => SpaceTemplatePosition,
        (spaceTemplatePosition) => spaceTemplatePosition.spaceVideos,
        {
            nullable: false,
        },
    )
    @JoinColumn({
        name: 'space_template_position_id',
    })
    spaceTemplatePosition: SpaceTemplatePosition;

    @ManyToOne(() => Video, (video) => video.spaceVideos)
    @JoinColumn({
        name: 'video_id',
    })
    video: Video;
}
