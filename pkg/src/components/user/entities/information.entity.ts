import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'informations' })
export class Information {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    name: string;

    @Column({ length: 255 })
    address: string;

    @Column({ length: 255 })
    email: string;

    @Column({
        name: 'media_id',
        nullable: true,
    })
    mediaId: number;

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

    @OneToOne(() => User, (user) => user.information)
    @JoinColumn({
        name: 'user_id',
        foreignKeyConstraintName: 'fk-users-informations',
    })
    user: User;
}
