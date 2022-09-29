import {
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Role } from './role.entity';

@Entity({ name: 'permissions' })
export class Permission {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    slug: string;

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

    @ManyToMany(() => Role)
    @JoinTable({
        name: 'roles_permissions',
        joinColumn: {
            name: 'permission_id',
            referencedColumnName: 'id',
            foreignKeyConstraintName: 'fk-permissions-roles',
        },
        inverseJoinColumn: {
            name: 'role_id',
            referencedColumnName: 'id',
            foreignKeyConstraintName: 'fk-roles-permissions',
        },
    })
    roles: Role[];
}
