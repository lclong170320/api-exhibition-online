import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    Unique,
    UpdateDateColumn,
} from 'typeorm';
import { BoothOrganization } from './booth-organization.entity';
import { Booth } from './booth.entity';
import { Category } from './category.entity';
import { Conference } from './conference.entity';
import { Space } from './space.entity';
import { Contact } from './contact.entity';

export enum Status {
    NEW = 'new',
    LISTING = 'listing',
    FINISHED = 'finished',
}

@Entity({ name: 'exhibition' })
@Unique(['slug'])
export class Exhibition {
    // table columns
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    slug: string;

    @Column({ name: 'booth_number' })
    boothNumber: number;

    @Column({ name: 'exhibition_code', length: 255 })
    exhibitionCode: string;

    @Column({ type: 'datetime', name: 'date_exhibition_start' })
    dateExhibitionStart: Date;

    @Column({ type: 'datetime', name: 'date_exhibition_end' })
    dateExhibitionEnd: Date;

    @Column({ type: 'longtext' })
    introduction: string;

    @Column({ type: 'longtext' })
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

    @DeleteDateColumn({
        type: 'timestamp',
        name: 'deleted_at',
        nullable: true,
    })
    deletedAt: Date;

    // relation columns
    @ManyToOne(() => Category, (category) => category.exhibitions)
    @JoinColumn({
        name: 'category_id',
    })
    category: Category;

    @OneToOne(
        () => BoothOrganization,
        (boothOrganization) => boothOrganization.exhibition,
    )
    @JoinColumn({
        name: 'booth_organization_id',
    })
    boothOrganization: BoothOrganization;

    @OneToOne(() => Space, (space) => space.exhibition)
    @JoinColumn({
        name: 'space_id',
    })
    space: Space;

    @OneToMany(() => Booth, (booth) => booth.exhibition)
    booths: Booth[];

    @OneToOne(() => Conference, (conference) => conference.exhibition)
    @JoinColumn({
        name: 'conference_id',
    })
    conference: Conference;

    @OneToMany(() => Contact, (contact) => contact.exhibition)
    contacts: Contact[];
}
