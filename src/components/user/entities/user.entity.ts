import { User as UserDto } from '@/components/user/dto/user.dto';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Information } from './information.entity';
import { Role } from './role.entity';

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255, unique: true })
    phone: string;

    @Column({ length: 255 })
    password: string;

    @Column({
        name: 'department_id',
    })
    departmentId: number;

    @Column()
    status: UserDto.StatusEnum;

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

    @OneToOne(() => Information, (information) => information.user)
    information: Information;

    @ManyToOne(() => Role, (role) => role.users)
    @JoinColumn({
        name: 'role_id',
        foreignKeyConstraintName: 'fk-users-roles',
    })
    role: Role;
}
