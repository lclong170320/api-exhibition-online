import {
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { BoothOrganization } from './booth-organization.entity';
import { Project } from './project.entity';
import { BoothOrganizationTemplatePosition } from './booth-organization-template-position.entity';

@Entity({ name: 'booth_organization_project' })
export class BoothOrganizationProject {
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
    @ManyToOne(
        () => BoothOrganization,
        (boothOrganization) => boothOrganization.boothOrganizationProjects,
    )
    @JoinColumn({
        name: 'booth_organization_id',
    })
    boothOrganization: BoothOrganization;

    @ManyToOne(
        () => BoothOrganizationTemplatePosition,
        (boothOrganizationTemplatePosition) =>
            boothOrganizationTemplatePosition.boothOrganizationProjects,
    )
    @JoinColumn({
        name: 'booth_organization_template_position_id',
    })
    boothOrganizationTemplatePosition: BoothOrganizationTemplatePosition;

    @ManyToOne(() => Project, (project) => project.boothOrganizationProjects)
    @JoinColumn({
        name: 'project_id',
    })
    project: Project;
}
