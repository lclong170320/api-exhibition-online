import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { BoothImage } from './booth-image.entity';
import { BoothOrganizationImage } from './booth-organization-image.entity';
import { SpaceImage } from './space-image.entity';

@Entity({ name: 'image' })
export class Image {
    // tables name
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'image_id' })
    imageId: number;

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
    @OneToMany(() => BoothImage, (boothImage) => boothImage.image)
    boothImages: BoothImage[];

    @OneToMany(
        () => BoothOrganizationImage,
        (boothOrganizationImage) => boothOrganizationImage.image,
    )
    boothOrganizationImages: BoothOrganizationImage[];

    @OneToMany(() => SpaceImage, (spaceImage) => spaceImage.image)
    spaceImages: SpaceImage[];
}
