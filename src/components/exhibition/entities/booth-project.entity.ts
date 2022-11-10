import {
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { BoothTemplatePosition } from './booth-template-position.entity';
import { Booth } from './booth.entity';
import { Project } from './project.entity';

@Entity({ name: 'booth_project' })
export class BoothProject {
    // table columns
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

    @DeleteDateColumn({
        type: 'timestamp',
        name: 'deleted_at',
        nullable: true,
    })
    deletedAt: Date;

    // relation columns
    @ManyToOne(() => Booth, (booth) => booth.boothProjects)
    @JoinColumn({
        name: 'booth_id',
    })
    booth: Booth;

    @ManyToOne(() => Project, (project) => project.boothProjects)
    @JoinColumn({
        name: 'project_id',
    })
    project: Project;

    @ManyToOne(
        () => BoothTemplatePosition,
        (boothTemplatePosition) => boothTemplatePosition.boothProjects,
    )
    @JoinColumn({
        name: 'booth_template_position_id',
    })
    boothTemplatePosition: BoothTemplatePosition;
}
