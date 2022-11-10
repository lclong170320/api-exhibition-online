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
import { Image } from './image.entity';

@Entity({ name: 'booth_image' })
export class BoothImage {
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

    // relations columns
    @ManyToOne(
        () => BoothTemplatePosition,
        (boothTemplatePosition) => boothTemplatePosition.boothImages,
    )
    @JoinColumn({
        name: 'booth_template_position_id',
    })
    boothTemplatePosition: BoothTemplatePosition;

    @ManyToOne(() => Booth, (booth) => booth.boothImages)
    @JoinColumn({
        name: 'booth_id',
    })
    booth: Booth;

    @ManyToOne(() => Image, (image) => image.boothImages)
    @JoinColumn({
        name: 'image_id',
    })
    image: Image;
}
