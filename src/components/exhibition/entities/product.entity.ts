import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { BoothOrganizationProduct } from './booth-organization-product.entity';
import { BoothProduct } from './booth-product.entity';

@Entity({ name: 'product' })
export class Product {
    // table columns
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    name: string;

    @Column({ name: 'image_id' })
    imageId: number;

    @Column({ type: 'float' })
    price: number;

    @Column({ name: 'purchase_link', length: 255 })
    purchaseLink: string;

    @Column({ length: 500 })
    description: string;

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
    @OneToMany(() => BoothProduct, (boothProduct) => boothProduct.product)
    boothProducts: BoothProduct[];

    @OneToMany(
        () => BoothOrganizationProduct,
        (boothOrganizationProduct) => boothOrganizationProduct.product,
    )
    boothOrganizationProducts: BoothOrganizationProduct[];
}
