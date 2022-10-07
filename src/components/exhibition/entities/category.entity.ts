import {
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Column,
} from 'typeorm';
import { Exhibition } from './exhibition.entity';

@Entity({ name: 'categories' })
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

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

    @OneToMany(() => Exhibition, (exhibition) => exhibition.category)
    exhibitions: Exhibition[];
}
