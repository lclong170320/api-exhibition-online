import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Column,
    OneToMany,
    ManyToMany,
} from 'typeorm';
import { Exhibition } from './exhibition.entity';
import { PositionBooth } from './position-booth.entity';
import { Booth } from './booth.entity';
import { BoothTemplatePosition } from './booth-template-position.entity';

export enum Type {
    PROJECT = 'project',
    PRODUCT = 'product',
}

@Entity({ name: 'booth_template' })
export class BoothTemplate {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'created_by' })
    createdBy: number;

    @Column({ name: 'name' })
    name: string;

    @Column({ type: 'enum', enum: Type })
    type: Type;

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

    @OneToMany(() => Booth, (booth) => booth.boothTemplate)
    booths: Booth[];

    @OneToMany(() => PositionBooth, (position) => position.boothTemplate)
    positionBooths: PositionBooth[];

    @ManyToMany(() => Exhibition)
    exhibitions: Exhibition[];

    @OneToMany(
        () => BoothTemplatePosition,
        (boothTemplatePosition) => boothTemplatePosition.boothTemplate,
    )
    boothTemplatePositions: BoothTemplatePosition[];
}
