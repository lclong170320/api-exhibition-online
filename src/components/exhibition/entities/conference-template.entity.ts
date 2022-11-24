import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { ConferenceTemplatePosition } from './conference-template-position.entity';

@Entity({ name: 'conference_template' })
export class ConferenceTemplate {
    // tables column
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'created_by' })
    createdBy: number;

    @Column()
    name: string;

    @Column({ type: 'datetime', name: 'created_date' })
    createdDate: Date;

    @Column({ name: 'model_id' })
    modelId: number;

    @Column({ name: 'thumbnail_id' })
    thumbnailId: number;

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

    @OneToMany(
        () => ConferenceTemplatePosition,
        (conferenceTemplatePosition) =>
            conferenceTemplatePosition.conferenceTemplate,
    )
    conferenceTemplatePositions: ConferenceTemplatePosition[];
}
