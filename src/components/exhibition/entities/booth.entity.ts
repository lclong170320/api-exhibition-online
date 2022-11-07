import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { BoothData } from './booth-data.entity';
import { BoothTemplate } from './booth-template.entity';
import { Exhibition } from './exhibition.entity';
import { LiveStream } from './live-stream.entity';
import { LocationStatus } from './location-status.entity';
import { Product } from './product.entity';
import { Project } from './project.entity';

@Entity({ name: 'booths' })
export class Booth {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    name: string;

    @Column({ name: 'enterprise_id' })
    enterpriseId: number;

    @Column({ name: 'created_by' })
    createdBy: number;

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
        name: 'booth_template_id',
        foreignKeyConstraintName: 'fk-booths-booth_template',
    })
    boothTemplate: BoothTemplate;

    @OneToMany(() => LiveStream, (liveStream) => liveStream.booth)
    liveStreams: LiveStream[];

    @OneToMany(() => BoothData, (boothData) => boothData.booth)
    boothData: BoothData[];

    @OneToMany(() => Project, (project) => project.booth)
    projects: Project[];

    @OneToMany(() => Product, (product) => product.booth)
    products: Product[];
}
