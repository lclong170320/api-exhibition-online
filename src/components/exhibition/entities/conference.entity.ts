import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { ConferenceImage } from './conference-image.entity';
import { ConferenceTemplate } from './conference-template.entity';
import { ConferenceVideo } from './conference-video.entity';
import { Exhibition } from './exhibition.entity';

@Entity({ name: 'conference' })
export class Conference {
    // table columns
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    name: string;

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
    @OneToOne(() => Exhibition, (exhibition) => exhibition.conference)
    exhibition: Exhibition;

    @ManyToOne(
        () => ConferenceTemplate,
        (conferenceTemplate) => conferenceTemplate.conferences,
    )
    @JoinColumn({
        name: 'conference_template_id',
        foreignKeyConstraintName: 'fk-conference-conferences_template',
    })
    conferenceTemplate: ConferenceTemplate;

    @OneToMany(
        () => ConferenceImage,
        (conferenceImage) => conferenceImage.conference,
    )
    conferenceImages: ConferenceImage[];

    @OneToMany(
        () => ConferenceVideo,
        (conferenceVideo) => conferenceVideo.conference,
    )
    conferenceVideos: ConferenceVideo[];
}
