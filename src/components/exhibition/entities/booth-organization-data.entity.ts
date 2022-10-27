import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { BoothOrganization } from './booth-organization.entity';
import { PositionBooth } from './position-booth.entity';

@Entity({ name: 'booth_organization_data' })
export class BoothOrganizationData {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'media_id', nullable: true })
    mediaId: number;

    @Column({ length: 255, nullable: true })
    title: string;

    @Column({ type: 'longtext', nullable: true })
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

    @ManyToOne(
        () => BoothOrganization,
        (boothOrganization) => boothOrganization.boothOrganizationData,
        { nullable: false },
    )
    @JoinColumn({
        name: 'booth_organization_id',
        foreignKeyConstraintName:
            'fk-booth_organization_datas-booth_organizations',
    })
    boothOrganization: BoothOrganization;

    @ManyToOne(
        () => PositionBooth,
        (positionBooth) => positionBooth.boothOrganizationData,
        {
            nullable: false,
        },
    )
    @JoinColumn({
        name: 'position_booth_id',
        foreignKeyConstraintName: 'fk-booth_organization_datas-position_booths',
    })
    positionBooth: PositionBooth;
}
