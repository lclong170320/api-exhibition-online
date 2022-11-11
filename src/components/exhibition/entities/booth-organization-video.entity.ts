import {
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { BoothOrganizationTemplatePosition } from './booth-organization-template-position.entity';
import { BoothOrganization } from './booth-organization.entity';
import { Video } from './video.entity';

@Entity({ name: 'booth_organization_video' })
export class BoothOrganizationVideo {
    // tables column
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

    // relations name
    @ManyToOne(
        () => BoothOrganization,
        (boothOrganization) => boothOrganization.boothOrganizationVideos,
    )
    @JoinColumn({
        name: 'booth_organization_id',
    })
    boothOrganization: BoothOrganization;

    @ManyToOne(
        () => BoothOrganizationTemplatePosition,
        (boothOrganizationTemplatePosition) =>
            boothOrganizationTemplatePosition.boothOrganizationVideos,
    )
    @JoinColumn({
        name: 'booth_organization_template_position_id',
    })
    boothOrganizationTemplatePosition: BoothOrganizationTemplatePosition;

    @ManyToOne(() => Video, (video) => video.boothOrganizationVideos)
    @JoinColumn({
        name: 'video_id',
    })
    video: Video;
}
