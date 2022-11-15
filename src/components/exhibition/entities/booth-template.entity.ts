import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Booth } from './booth.entity';
import { BoothTemplatePosition } from './booth-template-position.entity';

export enum Type {
    PROJECT = 'project',
    PRODUCT = 'product',
}

@Entity({ name: 'booth_template' })
export class BoothTemplate {
    // tables column
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'created_by' })
    createdBy: number;

    @Column()
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

    @DeleteDateColumn({
        type: 'timestamp',
        name: 'deleted_at',
        nullable: true,
    })
    deletedAt: Date;

    // relation columns
    @OneToMany(() => Booth, (booth) => booth.boothTemplate)
    booths: Booth[];

    @OneToMany(
        () => BoothTemplatePosition,
        (boothTemplatePosition) => boothTemplatePosition.boothTemplate,
    )
    boothTemplatePositions: BoothTemplatePosition[];
}
