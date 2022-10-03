import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Exhibition } from './exhibition.entity';
import { SpaceData } from './space-data.entity';
import { SpaceTemplate } from './space-template.entity';

@Entity({ name: 'spaces' })
export class Space {
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

    @OneToMany(() => SpaceData, (spaceData) => spaceData.space)
    spaceDatas: SpaceData[];

    @ManyToOne(() => SpaceTemplate, (spaceTemplate) => spaceTemplate.spaces, {
        nullable: false,
    })
    @JoinColumn({
        name: 'space_template_id',
        foreignKeyConstraintName: 'fk-spaces-space_templates',
    })
    spaceTemplate: SpaceTemplate;

    @OneToOne(() => Exhibition, (exhibition) => exhibition.space, {
        nullable: false,
    })
    @JoinColumn({
        name: 'exhibition_id',
        foreignKeyConstraintName: 'fk_exhibition_space',
    })
    exhibition: Exhibition;
}
