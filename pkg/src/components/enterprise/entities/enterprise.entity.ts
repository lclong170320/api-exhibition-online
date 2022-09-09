import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Column,
    OneToMany,
    OneToOne,
} from 'typeorm';
import { Document } from './document.entity';
import { Profile } from './profile.entity';

@Entity({ name: 'enterprises' })
export class Enterprise {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    name: string;

    @Column({ length: 255, name: 'tax_code' })
    taxCode: string;

    @Column({ length: 255 })
    ceo: string;

    @Column({ length: 255, name: 'main_job' })
    mainJob: string;

    @Column({ length: 255 })
    slogan: string;

    @Column({ length: 255, name: 'business_license' })
    businessLicense: string;

    @Column({ length: 255, name: 'office_address' })
    officeAddress: string;

    @Column({
        type: 'date',
        name: 'license_date',
    })
    licenseDate: Date;

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

    @OneToMany(() => Document, (document) => document.enterprise)
    documents: Document[];

    @OneToOne(() => Profile, (profile) => profile.enterprise)
    profile: Profile;
}
