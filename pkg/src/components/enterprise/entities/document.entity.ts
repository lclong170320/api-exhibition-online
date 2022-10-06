import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Enterprise } from './enterprise.entity';

@Entity({ name: 'documents' })
export class Document {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        name: 'user_id',
    })
    userId: number;

    @Column({
        name: 'enterprise_id',
    })
    enterpriseId: number;

    @Column({
        length: 255,
        name: 'title',
    })
    title: string;

    @Column({
        type: 'text',
        name: 'content',
    })
    content: string;

    @Column({
        type: 'json',
        name: 'medias',
        nullable: true,
    })
    medias: Array<string>;

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

    @ManyToOne(() => Enterprise, (enterprise) => enterprise.documents, {
        nullable: false,
    })
    @JoinColumn({
        name: 'enterprise_id',
        foreignKeyConstraintName: 'fk_enterprise_documents',
    })
    enterprise: Enterprise;
}
