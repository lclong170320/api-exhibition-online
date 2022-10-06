import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { BoothTemplate } from './booth-template.entity';
import { Booth } from './booth.entity';
import { Category } from './category.entity';
import { Space } from './space.entity';

@Entity({ name: 'exhibitions' })
export class Exhibition {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ type: 'text' })
    description: string;

    @Column({ name: 'booth_number' })
    boothNumber: number;

    @Column({ name: 'exhibition_code', length: 255 })
    exhibitionCode: string;

    @Column({ type: 'datetime', name: 'date_exhibition_start' })
    dateExhibitionStart: Date;

    @Column({ type: 'datetime', name: 'date_exhibition_end' })
    dateExhibitionEnd: Date;

    @Column({ type: 'datetime', name: 'date_input_data_start' })
    dateInputDataStart: Date;

    @Column({ type: 'datetime', name: 'date_input_data_end' })
    dateInputDataEnd: Date;

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

    @ManyToOne(() => Category, (category) => category.exhibitions, {
        nullable: false,
    })
    @JoinColumn({
        name: 'category_id',
        foreignKeyConstraintName: 'fk_category_exhibition',
    })
    category: Category;

    @OneToMany(() => Booth, (booth) => booth.exhibition)
    booths: Booth[];

    @OneToOne(() => Space, (space) => space.exhibition)
    space: Space;

    @ManyToMany(() => BoothTemplate)
    @JoinTable({
        name: 'exhibitions_booth_templates',
        joinColumn: {
            name: 'exhibitions_id',
            referencedColumnName: 'id',
            foreignKeyConstraintName: 'fk-exhibitions_booth-templates',
        },
        inverseJoinColumn: {
            name: 'booth_template_id',
            referencedColumnName: 'id',
            foreignKeyConstraintName: 'fk-booth-templates-exhibitions',
        },
    })
    boothTemplates: BoothTemplate[];
}
