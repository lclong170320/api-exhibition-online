import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Column,
    OneToOne,
    JoinColumn,
} from 'typeorm';
import { Enterprise } from './enterprise.entity';

@Entity({ name: 'profiles' })
export class Profile {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        name: 'enterprise_id',
    })
    enterpriseId: number;

    @Column({
        type: 'json',
        name: 'document_ids',
    })
    documentIds: Array<number>;

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

    @OneToOne(() => Enterprise, (enterprise) => enterprise.profile, {
        nullable: false,
    })
    @JoinColumn({
        name: 'enterprise_id',
        foreignKeyConstraintName: 'fk_enterprise_profile',
    })
    enterprise: Enterprise;
}
