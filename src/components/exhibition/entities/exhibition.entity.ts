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
import { BoothOrganization } from './booth-organization.entity';
import { Category } from './category.entity';
import { Space } from './space.entity';
import { Booth } from './booth.entity';

export enum Status {
    NEW = 'new',
    LISTING = 'listing',
    FINISHED = 'finished',
}

@Entity({ name: 'exhibitions' })
export class Exhibition {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ name: 'booth_number' })
    boothNumber: number;

    @Column({ name: 'exhibition_code', length: 255 })
    exhibitionCode: string;

    @Column({ type: 'datetime', name: 'date_exhibition_start' })
    dateExhibitionStart: Date;

    @Column({ type: 'datetime', name: 'date_exhibition_end' })
    dateExhibitionEnd: Date;

    @Column('longtext')
    introduction: string;

    @Column('longtext')
    agenda: string;

    @Column({ type: 'enum', enum: Status, default: Status.NEW })
    status: Status;

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

    @ManyToOne(() => Category, (category) => category.exhibitions, {
        nullable: false,
    })
    @JoinColumn({
        name: 'category_id',
    })
    category: Category;

    @OneToOne(
        () => BoothOrganization,
        (boothOrganization) => boothOrganization.exhibition,
        {
            nullable: false,
        },
    )
    @JoinColumn({
        name: 'booth_organization_id',
    })
    boothOrganization: BoothOrganization;

    @OneToOne(() => Space, (space) => space.exhibition, {
        nullable: false,
    })
    @JoinColumn({
        name: 'space_id',
    })
    space: Space;

    @OneToMany(() => Booth, (booth) => booth.exhibition)
    booths: Booth[];
}
