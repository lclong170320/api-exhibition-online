import {
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Pano } from './pano.entity';

@Entity({ name: 'exhibitions' })
export class Exhibition {
    @PrimaryGeneratedColumn()
    id: number;

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

    @OneToMany(() => Pano, (pano) => pano.exhibition)
    panos: Pano[];
}
