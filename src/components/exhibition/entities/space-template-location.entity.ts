import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Location } from './location.entity';
import { SpaceTemplate } from './space-template.entity';

@Entity({ name: 'space_template_location' })
export class SpaceTemplateLocation {
    // table columns
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    name: string;

    @Column({ name: 'position_x' })
    positionX: number;

    @Column({ name: 'position_y' })
    positionY: number;

    @Column({ name: 'position_z' })
    positionZ: number;

    @Column({ name: 'rotation_x' })
    rotationX: number;

    @Column({ name: 'rotation_y' })
    rotationY: number;

    @Column({ name: 'rotation_z' })
    rotationZ: number;

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
        () => SpaceTemplate,
        (spaceTemplate) => spaceTemplate.spaceTemplateLocation,
    )
    @JoinColumn({
        name: 'space_template_id',
    })
    spaceTemplate: SpaceTemplate;

    @OneToMany(() => Location, (location) => location.spaceTemplateLocation)
    locations: Location[];
}
