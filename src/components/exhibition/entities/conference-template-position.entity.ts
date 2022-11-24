import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { ConferenceTemplate } from './conference-template.entity';

export enum Type {
    IMAGE = 'image',
    VIDEO = 'video',
}

@Entity({ name: 'conference_template_position' })
export class ConferenceTemplatePosition {
    // table columns
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    position: string;

    @Column({ type: 'enum', enum: Type })
    type: Type;

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

    @DeleteDateColumn({
        type: 'timestamp',
        name: 'deleted_at',
        nullable: true,
    })
    deletedAt: Date;

    // relation columns
    @ManyToOne(
        () => ConferenceTemplate,
        (conferenceTemplate) => conferenceTemplate.conferenceTemplatePositions,
    )
    @JoinColumn({
        name: 'conference_template_id',
        foreignKeyConstraintName:
            'fk-conference_template_position-conference_template',
    })
    conferenceTemplate: ConferenceTemplate;
}
