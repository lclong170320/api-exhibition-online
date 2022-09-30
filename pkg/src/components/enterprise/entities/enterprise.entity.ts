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
import { Enterprise as EnterpriseDto } from '../dto/enterprise.dto';

@Entity({ name: 'enterprises' })
export class Enterprise {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255, name: 'international_name' })
    internationalName: string;

    @Column({ length: 255, name: 'abbreviation' })
    abbreviation: string;

    @Column({ length: 255, name: 'tax_code' })
    taxCode: string;

    @Column({ length: 255 })
    address: string;

    @Column({ length: 255 })
    ceo: string;

    @Column({ length: 255 })
    phone: string;

    @Column({ type: 'datetime', name: 'active_date' })
    activeDate: Date;

    @Column({ length: 255 })
    status: EnterpriseDto.StatusEnum;

    @Column({ length: 255, name: 'type_of_business' })
    typeOfBusiness: string;

    @Column({ length: 255, name: 'manager_by' })
    managerBy: string;

    @Column({ length: 255, name: 'view_company_online', nullable: true })
    viewCompanyOnline: string;

    @Column({ type: 'datetime', name: 'created_date' })
    createdDate: Date;

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

    @Column({ name: 'created_by' })
    createdBy: number;

    @Column({ name: 'is_deleted', default: false })
    isDeleted: boolean;
}
