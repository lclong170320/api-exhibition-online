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
import { ConferenceTemplatePosition } from './conference-template-position.entity';
import { Conference } from './conference.entity';

@Entity({ name: 'conference_image' })
export class ConferenceImage {
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
    @ManyToOne(() => Conference, (conference) => conference.conferenceImages)
    @JoinColumn({
        name: 'conference_id',
        foreignKeyConstraintName: 'fk-conference_image-conference',
    })
    conference: Conference;

    @ManyToOne(
        () => ConferenceTemplatePosition,
        (conferenceTemplatePosition) =>
            conferenceTemplatePosition.conferenceImages,
    )
    @JoinColumn({
        name: 'conference_template_position_id',
        foreignKeyConstraintName:
            'fk-conference_image-conference_template_position',
    })
    conferenceTemplatePosition: ConferenceTemplatePosition;

    @ManyToOne(() => Image, (image) => image.conferenceImages)
    @JoinColumn({
        name: 'image_id',
        foreignKeyConstraintName: 'fk-conference_image-image',
    })
    image: Image;
}
