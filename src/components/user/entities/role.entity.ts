import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Permission } from './permission.entity';
import { User } from './user.entity';

@Entity({ name: 'roles' })
export class Role {
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

    @OneToMany(() => User, (user) => user.role)
    users: User[];

    @ManyToMany(() => Permission)
    permissions: Permission[];
}
