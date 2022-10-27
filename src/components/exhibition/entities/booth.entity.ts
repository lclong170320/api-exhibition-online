import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { BoothTemplate } from './booth-template.entity';
import { Exhibition } from './exhibition.entity';
import { LocationStatus } from './location-status.entity';

@Entity({ name: 'booths' })
export class Booth {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    name: string;

    @Column({ name: 'enterprise_id' })
    enterpriseId: number;

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

    @OneToOne(() => LocationStatus, (locationStatus) => locationStatus.booth, {
        nullable: false,
    })
    @JoinColumn({
        name: 'location_status_id',
        foreignKeyConstraintName: 'fk-booht-location_status',
    })
    locationStatus: LocationStatus;

    @ManyToOne(() => Exhibition, (exhibition) => exhibition.booths, {
        nullable: false,
    })
    @JoinColumn({
        name: 'exhibition_id',
        foreignKeyConstraintName: 'fk-booths-exhibition',
    })
    exhibition: Exhibition;

    @ManyToOne(() => BoothTemplate, (boothTemplate) => boothTemplate.booths, {
        nullable: false,
    })
    @JoinColumn({
        name: 'booth_id',
        foreignKeyConstraintName: 'fk-booths-booth_template',
    })
    boothTemplate: BoothTemplate;
}
