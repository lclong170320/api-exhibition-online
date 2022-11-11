import {
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { BoothOrganizationTemplatePosition } from './booth-organization-template-position.entity';
import { BoothOrganization } from './booth-organization.entity';
import { Image } from './image.entity';

@Entity({ name: 'booth_organization_image' })
export class BoothOrganizationImage {
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

    // relation columns
    @ManyToOne(
        () => BoothOrganization,
        (boothOrganization) => boothOrganization.boothOrganizationImages,
    )
    @JoinColumn({
        name: 'booth_organization_id',
    })
    boothOrganization: BoothOrganization;

    @ManyToOne(
        () => BoothOrganizationTemplatePosition,
        (boothOrganizationTemplatePosition) =>
            boothOrganizationTemplatePosition.boothOrganizationImages,
    )
    @JoinColumn({
        name: 'booth_organization_template_position_id',
    })
    boothOrganizationTemplatePosition: BoothOrganizationTemplatePosition;

    @ManyToOne(() => Image, (image) => image.boothOrganizationImages)
    @JoinColumn({
        name: 'image_id',
    })
    image: Image;
}
