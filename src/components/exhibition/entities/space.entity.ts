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
import { Exhibition } from './exhibition.entity';
import { Location } from './location.entity';
import { SpaceImage } from './space-image.entity';
import { SpaceTemplate } from './space-template.entity';
import { SpaceVideo } from './space-video.entity';

@Entity({ name: 'space' })
export class Space {
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
    @OneToOne(() => Exhibition, (exhibition) => exhibition.space, {
        nullable: false,
    })
    exhibition: Exhibition;

    @ManyToOne(() => SpaceTemplate, (spaceTemplate) => spaceTemplate.spaces, {
        nullable: false,
    })
    @JoinColumn({
        name: 'space_template_id',
    })
    spaceTemplate: SpaceTemplate;

    @OneToMany(() => Location, (location) => location.space)
    locations: Location[];

    @OneToMany(() => SpaceImage, (spaceImage) => spaceImage.space)
    spaceImages: SpaceImage[];

    @OneToMany(() => SpaceVideo, (spaceVideo) => spaceVideo.space)
    spaceVideos: SpaceVideo[];
}
