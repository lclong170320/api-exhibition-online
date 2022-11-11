import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { SpaceImage } from './space-image.entity';
import { SpaceTemplate } from './space-template.entity';
import { SpaceVideo } from './space-video.entity';
export enum Type {
    IMAGE = 'image',
    VIDEO = 'video',
}
@Entity({ name: 'space_template_position' })
export class SpaceTemplatePosition {
    // table columns
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    position: string;

    @Column({ type: 'enum', enum: Type })
    type: Type;

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
    @ManyToOne(
        () => SpaceTemplate,
        (spaceTemplate) => spaceTemplate.spaceTemplatePositions,
    )
    @JoinColumn({
        name: 'space_template_id',
    })
    spaceTemplate: SpaceTemplate;

    @OneToMany(
        () => SpaceImage,
        (spaceImage) => spaceImage.spaceTemplatePosition,
    )
    spaceImages: SpaceImage[];

    @OneToMany(
        () => SpaceVideo,
        (spaceVideo) => spaceVideo.spaceTemplatePosition,
    )
    spaceVideos: SpaceVideo[];
}
