import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Column,
    DeleteDateColumn,
} from 'typeorm';

@Entity({ name: 'enterprise' })
export class Enterprise {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    name: string;

    @Column({ name: 'image_id' })
    imageId: number;

    @Column({ length: 255 })
    address: string;

    @Column({ length: 255 })
    phone: string;

    @Column({ length: 255 })
    email: string;

    @Column('longtext')
    description: string;

    @Column({ length: 255, name: 'type_of_business' })
    typeOfBusiness: string;

    @Column({ length: 255, name: 'link_website', nullable: true })
    linkWebsite: string;

    @Column({ length: 255, name: 'link_profile', nullable: true })
    linkProfile: string;

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

    @DeleteDateColumn({
        type: 'timestamp',
        name: 'deleted_at',
    })
    deletedAt: Date;
}
