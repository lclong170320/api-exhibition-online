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
import { BoothImage } from './booth-image.entity';
import { BoothProduct } from './booth-product.entity';
import { BoothProject } from './booth-project.entity';
import { BoothTemplate } from './booth-template.entity';
import { BoothVideo } from './booth-video.entity';

export enum Type {
    IMAGE = 'image',
    VIDEO = 'video',
    PROJECT = 'project',
    PRODUCT = 'product',
}

@Entity({ name: 'booth_template_position' })
export class BoothTemplatePosition {
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
    @OneToMany(
        () => BoothImage,
        (boothImage) => boothImage.boothTemplatePosition,
    )
    boothImages: BoothImage[];

    @OneToMany(
        () => BoothVideo,
        (boothVideo) => boothVideo.boothTemplatePosition,
    )
    boothVideos: BoothVideo[];

    @OneToMany(
        () => BoothProduct,
        (boothProduct) => boothProduct.boothTemplatePosition,
    )
    boothProducts: BoothProduct[];

    @OneToMany(
        () => BoothProject,
        (boothProject) => boothProject.boothTemplatePosition,
    )
    boothProjects: BoothProject[];

    @ManyToOne(
        () => BoothTemplate,
        (boothTemplate) => boothTemplate.boothTemplatePositions,
    )
    @JoinColumn({
        name: 'booth_template_id',
    })
    boothTemplate: BoothTemplate;
}
