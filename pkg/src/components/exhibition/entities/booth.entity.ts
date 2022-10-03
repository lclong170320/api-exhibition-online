import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { BoothData } from './booth-data.entity';
import { BoothTemplate } from './booth-template.entity';
import { Exhibition } from './exhibition.entity';

@Entity({ name: 'booths' })
export class Booth {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    name: string;

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

    @OneToMany(() => BoothData, (boothData) => boothData.booth)
    boothDatas: BoothData[];

    @ManyToOne(() => BoothTemplate, (boothTemplate) => boothTemplate.booths, {
        nullable: false,
    })
    @JoinColumn({
        name: 'booth_template_id',
        foreignKeyConstraintName: 'fk-booths-booth_templates',
    })
    boothTemplate: BoothTemplate;

    @ManyToOne(() => Exhibition, (exhibition) => exhibition.booths, {
        nullable: false,
    })
    @JoinColumn({
        name: 'exhibition_id',
        foreignKeyConstraintName: 'fk-booths-exhibitions',
    })
    exhibition: Exhibition;
}
