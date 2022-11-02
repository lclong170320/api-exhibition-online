import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Booth } from './booth.entity';
import { PositionBooth } from './position-booth.entity';

@Entity({ name: 'products' })
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    name: string;

    @Column({ name: 'media_id', nullable: true })
    mediaId: number;

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

    @ManyToOne(() => Booth, (booth) => booth.products, {
        nullable: false,
    })
    @JoinColumn({
        name: 'booth_id',
        foreignKeyConstraintName: 'fk-products-booth',
    })
    booth: Booth;

    @ManyToOne(() => PositionBooth, (positionBooth) => positionBooth.products, {
        nullable: false,
    })
    @JoinColumn({
        name: 'position_booth_id',
        foreignKeyConstraintName: 'fk-products-position_booths',
    })
    positionBooth: PositionBooth;
}
