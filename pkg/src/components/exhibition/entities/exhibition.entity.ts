import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'exhibition' })
export class Exhibition {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    name: string;

    @Column({
        type: 'date',
    })
    created_at: any;

    @Column({
        type: 'date',
    })
    updated_at: any;
}
