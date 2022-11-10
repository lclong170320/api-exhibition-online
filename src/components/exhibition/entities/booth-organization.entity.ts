import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { BoothOrganizationData } from './booth-organization-data.entity';
import { Exhibition } from './exhibition.entity';

@Entity({ name: 'booth_organizations' })
export class BoothOrganization {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    name: string;

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

    @OneToMany(
        () => BoothOrganizationData,
        (boothOrganizationData) => boothOrganizationData.boothOrganization,
    )
    boothOrganizationData: BoothOrganizationData[];

    @OneToOne(() => Exhibition, (exhibition) => exhibition.boothOrganization)
    exhibition: Exhibition;
}
