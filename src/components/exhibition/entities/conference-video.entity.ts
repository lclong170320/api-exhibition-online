import {
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { ConferenceTemplatePosition } from './conference-template-position.entity';
import { Conference } from './conference.entity';
import { Video } from './video.entity';

@Entity({ name: 'conference_video' })
export class ConferenceVideo {
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
    @ManyToOne(() => Conference, (conference) => conference.conferenceVideos)
    @JoinColumn({
        name: 'conference_id',
        foreignKeyConstraintName: 'fk-conference_video-conference',
    })
    conference: Conference;

    @ManyToOne(
        () => ConferenceTemplatePosition,
        (conferenceTemplatePosition) =>
            conferenceTemplatePosition.conferenceVideos,
    )
    @JoinColumn({
        name: 'conference_template_position_id',
        foreignKeyConstraintName:
            'fk-conference_video-conference_template_position',
    })
    conferenceTemplatePosition: ConferenceTemplatePosition;

    @ManyToOne(() => Video, (video) => video.conferenceVideos)
    @JoinColumn({
        name: 'video_id',
        foreignKeyConstraintName: 'fk-conference_video-video',
    })
    video: Video;
}
