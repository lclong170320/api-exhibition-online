import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { SpaceTemplate } from './space-template.entity';

@Entity({ name: 'booth_locations' })
export class BoothLocation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    name: string;

    @Column({ name: 'position_x', length: 255 })
    positionX: string;

    @Column({ name: 'position_y', length: 255 })
    positionY: string;

    @Column({ name: 'position_z', length: 255 })
    positionZ: string;

    @Column({ name: 'rotation_x', length: 255 })
    rotationX: string;

    @Column({ name: 'rotation_y', length: 255 })
    rotationY: string;

    @Column({ name: 'rotation_z', length: 255 })
    rotationZ: string;

    @Column({ name: 'user_id' })
    userId: number;

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

    @ManyToOne(
        () => SpaceTemplate,
        (spaceTemplate) => spaceTemplate.exhibitions,
        {
            nullable: false,
        },
    )
    @JoinColumn({
        name: 'space_template_id',
        foreignKeyConstraintName: 'fk-space_templates-booth_location',
    })
    spaceTemplate: SpaceTemplate;
}
