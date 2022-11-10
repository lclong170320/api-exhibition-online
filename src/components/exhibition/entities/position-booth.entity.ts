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
import { BoothData } from './booth-data.entity';
import { BoothOrganizationData } from './booth-organization-data.entity';
import { BoothTemplate } from './booth-template.entity';

@Entity({ name: 'position_booths' })
export class PositionBooth {
    @PrimaryGeneratedColumn()
    id: number;

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

    @ManyToOne(() => BoothTemplate, (template) => template.positionBooths, {
        nullable: false,
    })
    @JoinColumn({
        name: 'booth_template_id',
        foreignKeyConstraintName: 'fk-position_templates-booth_templates',
    })
    boothTemplate: BoothTemplate;

    @OneToMany(
        () => BoothOrganizationData,
        (boothOrganizationData) => boothOrganizationData.positionBooth,
    )
    boothOrganizationData: BoothOrganizationData[];

    @OneToMany(() => BoothData, (boothData) => boothData.positionBooth)
    boothData: BoothData[];
}
