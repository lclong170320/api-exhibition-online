import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { SpaceData } from './space-data.entity';
import { SpaceTemplate } from './space-template.entity';

@Entity({ name: 'position_spaces' })
export class PositionSpace {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    name: string;

    @Column({ name: 'object_3d_id', length: 255 })
    object3dId: string;

    @Column({ length: 255 })
    type: string;

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
        (spaceTemplate) => spaceTemplate.positionSpaces,
        {
            nullable: false,
        },
    )
    @JoinColumn({
        name: 'space_template_id',
        foreignKeyConstraintName: 'fk-position_templates-space_templates',
    })
    spaceTemplate: SpaceTemplate;

    @OneToMany(() => SpaceData, (data) => data.positionSpace)
    spaceDatas: SpaceData[];
}
