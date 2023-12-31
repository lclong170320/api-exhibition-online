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
import { BoothOrganizationImage } from './booth-organization-image.entity';
import { BoothOrganizationProduct } from './booth-organization-product.entity';
import { BoothOrganizationProject } from './booth-organization-project.entity';
import { BoothOrganizationTemplate } from './booth-organization-template.entity';
import { BoothOrganizationVideo } from './booth-organization-video.entity';
import { Exhibition } from './exhibition.entity';

@Entity({ name: 'booth_organization' })
export class BoothOrganization {
    // table columns
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'position_x' })
    positionX: number;

    @Column({ name: 'position_y' })
    positionY: number;

    @Column({ name: 'position_z' })
    positionZ: number;

    @Column({ name: 'rotation_x' })
    rotationX: number;

    @Column({ name: 'rotation_y' })
    rotationY: number;

    @Column({ name: 'rotation_z' })
    rotationZ: number;

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
        (boothOrganizationImage) => boothOrganizationImage.boothOrganization,
    )
    boothOrganizationImages: BoothOrganizationImage[];

    @OneToMany(
        () => BoothOrganizationVideo,
        (boothOrganizationVideo) => boothOrganizationVideo.boothOrganization,
    )
    boothOrganizationVideos: BoothOrganizationVideo[];

    @OneToMany(
        () => BoothOrganizationProject,
        (boothOrganizationProject) =>
            boothOrganizationProject.boothOrganization,
    )
    boothOrganizationProjects: BoothOrganizationProject[];

    @OneToMany(
        () => BoothOrganizationProduct,
        (boothOrganizationProduct) =>
            boothOrganizationProduct.boothOrganization,
    )
    boothOrganizationProducts: BoothOrganizationProduct[];

    @ManyToOne(
        () => BoothOrganizationTemplate,
        (boothOrganizationTemplate) =>
            boothOrganizationTemplate.boothOrganizations,
    )
    @JoinColumn({
        name: 'booth_organization_template_id',
    })
    boothOrganizationTemplate: BoothOrganizationTemplate;

    @OneToOne(() => Exhibition, (exhibition) => exhibition.boothOrganization)
    exhibition: Exhibition;
}
