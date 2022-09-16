import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'medias' })
export class Media {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 255,
    })
    url: string;

    @Column({
        length: 255,
    })
    mime: string;

    @Column({ name: 'user_id' })
    userId: number;

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
}
