import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { BoothOrganizationTemplatePosition } from './booth-organization-template-position.entity';
import { BoothOrganization } from './booth-organization.entity';

@Entity({ name: 'booth_organization_template' })
export class BoothOrganizationTemplate {
    // table columns
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    name: string;

    @Column({ name: 'created_by' })
    createdBy: number;

    @Column({ type: 'datetime', name: 'created_date' })
    createdDate: Date;

    @Column({ name: 'model_id' })
    modelId: number;

    @Column({ name: 'thumbnail_id' })
    thumbnailId: number;

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
        () => BoothOrganization,
        (boothOrganization) => boothOrganization.boothOrganizationTemplate,
    )
    boothOrganizations: BoothOrganization[];

    @OneToMany(
        () => BoothOrganizationTemplatePosition,
        (boothOrganizationTemplatePosition) =>
            boothOrganizationTemplatePosition.boothOrganizationTemplate,
    )
    boothOrganizationTemplatePositions: BoothOrganizationTemplatePosition[];
}
