import {
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { BoothOrganization } from './booth-organization.entity';
import { Product } from './product.entity';
import { BoothOrganizationTemplatePosition } from './booth-organization-template-position.entity';

@Entity({ name: 'booth_organization_product' })
export class BoothOrganizationProduct {
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
        (boothOrganization) => boothOrganization.boothOrganizationProjects,
    )
    @JoinColumn({
        name: 'booth_organization_id',
    })
    boothOrganization: BoothOrganization;

    @ManyToOne(
        () => BoothOrganizationTemplatePosition,
        (boothOrganizationTemplatePosition) =>
            boothOrganizationTemplatePosition.boothOrganizationProducts,
    )
    @JoinColumn({
        name: 'booth_organization_template_position_id',
    })
    boothOrganizationTemplatePosition: BoothOrganizationTemplatePosition;

    @ManyToOne(() => Product, (product) => product.boothProducts)
    @JoinColumn({
        name: 'product_id',
    })
    product: Product;
}
