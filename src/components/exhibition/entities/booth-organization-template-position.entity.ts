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
import { BoothOrganizationImage } from './booth-organization-image.entity';
import { BoothOrganizationProduct } from './booth-organization-product.entity';
import { BoothOrganizationProject } from './booth-organization-project.entity';
import { BoothOrganizationTemplate } from './booth-organization-template.entity';
import { BoothOrganizationVideo } from './booth-organization-video.entity';
export enum Type {
    IMAGE = 'image',
    VIDEO = 'video',
    PROJECT = 'project',
    PRODUCT = 'product',
}
@Entity({ name: 'booth_organization_template_position' })
export class BoothOrganizationTemplatePosition {
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
        () => BoothOrganizationImage,
        (boothOrganizationImage) =>
            boothOrganizationImage.boothOrganizationTemplatePosition,
    )
    boothOrganizationImages: BoothOrganizationImage[];

    @OneToMany(
        () => BoothOrganizationVideo,
        (boothOrganizationVideo) =>
            boothOrganizationVideo.boothOrganizationTemplatePosition,
    )
    boothOrganizationVideos: BoothOrganizationVideo[];

    @OneToMany(
        () => BoothOrganizationProduct,
        (boothOrganizationProduct) =>
            boothOrganizationProduct.boothOrganizationTemplatePosition,
    )
    boothOrganizationProducts: BoothOrganizationProduct[];

    @OneToMany(
        () => BoothOrganizationProject,
        (boothOrganizationProject) =>
            boothOrganizationProject.boothOrganizationTemplatePosition,
    )
    boothOrganizationProjects: BoothOrganizationProject[];

    @ManyToOne(
        () => BoothOrganizationTemplate,
        (boothOrganizationTemplate) =>
            boothOrganizationTemplate.boothOrganizationTemplatePositions,
    )
    @JoinColumn({
        name: 'booth_organization_template_id',
    })
    boothOrganizationTemplate: BoothOrganizationTemplate;
}
