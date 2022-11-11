import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { BoothOrganizationVideo } from './booth-organization-video.entity';
import { BoothVideo } from './booth-video.entity';
import { SpaceVideo } from './space-video.entity';

@Entity({ name: 'video' })
export class Video {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'video_id' })
    videoId: number;

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
    @OneToMany(() => BoothVideo, (boothVideo) => boothVideo.video)
    boothVideos: BoothVideo[];

    @OneToMany(() => SpaceVideo, (spaceVideo) => spaceVideo.video)
    spaceVideos: SpaceVideo[];

    @OneToMany(
        () => BoothOrganizationVideo,
        (boothOrganizationVideo) => boothOrganizationVideo.video,
    )
    boothOrganizationVideos: BoothOrganizationVideo[];
}
