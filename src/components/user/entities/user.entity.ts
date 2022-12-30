import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Role } from './role.entity';
export enum Status {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}
@Entity({ name: 'user' })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ length: 255, unique: true })
    phone: string;

    @Column({ length: 255, unique: true })
    email: string;

    @Column({ length: 255 })
    password: string;

    @Column({ type: 'enum', enum: Status, default: Status.ACTIVE })
    status: Status;

    @Column({ name: 'created_by', nullable: true })
    createdBy: number;

    @Column({ type: 'datetime', name: 'created_date' })
    createdDate: Date;

    @Column({ name: 'enterprise_id' })
    enterpriseId: number;

    @Column({ nullable: true })
    key: string;

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

    @ManyToOne(() => Role, (role) => role.users)
    @JoinColumn({
        name: 'role_id',
        foreignKeyConstraintName: 'fk-users-roles',
    })
    role: Role;
}
