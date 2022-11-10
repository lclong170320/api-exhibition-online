import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { BoothProject } from './booth-project.entity';

@Entity({ name: 'project' })
export class Project {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'image_id' })
    imageId: number;

    @Column({ length: 255 })
    title: string;

    @Column({ type: 'longtext' })
    description: string;

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
    @OneToMany(() => BoothProject, (boothProject) => boothProject.project)
    boothProjects: BoothProject[];
}
