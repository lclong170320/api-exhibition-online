import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Column,
    OneToMany,
    ManyToMany,
} from 'typeorm';
import { BoothOrganization } from './booth-organization.entity';
import { Exhibition } from './exhibition.entity';
import { PositionBooth } from './position-booth.entity';
import { BoothTemplate as BoothTemplateDto } from '../dto/booth-template.dto';
import { Booth } from './booth.entity';

@Entity({ name: 'booth_templates' })
export class BoothTemplate {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'created_by' })
    createdBy: number;

    @Column({ name: 'name' })
    name: string;

    @Column({ name: 'type' })
    type: BoothTemplateDto.TypeEnum;

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

    @OneToMany(
        () => BoothOrganization,
        (boothOrganization) => boothOrganization.boothTemplate,
    )
    boothOrganizations: BoothOrganization[];

    @OneToMany(() => Booth, (booth) => booth.boothTemplate)
    booths: Booth[];

    @OneToMany(() => PositionBooth, (position) => position.boothTemplate)
    positionBooths: PositionBooth[];

    @ManyToMany(() => Exhibition)
    exhibitions: Exhibition[];
}
