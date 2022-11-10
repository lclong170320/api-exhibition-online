import {
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { BoothTemplatePosition } from './booth-template-position.entity';
import { Booth } from './booth.entity';
import { Product } from './product.entity';

@Entity({ name: 'booth_product' })
export class BoothProduct {
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
    @ManyToOne(() => Booth, (booth) => booth.boothProducts)
    @JoinColumn({
        name: 'booth_id',
    })
    booth: Booth;

    @ManyToOne(() => Product, (product) => product.boothProducts)
    @JoinColumn({
        name: 'product_id',
    })
    product: Product;

    @ManyToOne(
        () => BoothTemplatePosition,
        (boothTemplatePosition) => boothTemplatePosition.boothProducts,
    )
    @JoinColumn({
        name: 'position_booth_id',
    })
    boothTemplatePosition: BoothTemplatePosition;
}
