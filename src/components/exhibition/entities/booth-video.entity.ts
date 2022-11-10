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
import { Video } from './video.entity';

@Entity({ name: 'booth_video' })
export class BoothVideo {
    //table columns
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

    //relations columns
    @ManyToOne(
        () => BoothTemplatePosition,
        (boothTemplatePosition) => boothTemplatePosition.boothVideos,
    )
    @JoinColumn({
        name: 'booth_template_position_id',
    })
    boothTemplatePosition: BoothTemplatePosition;

    @ManyToOne(() => Booth, (booth) => booth.boothVideos)
    @JoinColumn({
        name: 'booth_id',
    })
    booth: Booth;

    @ManyToOne(() => Video, (video) => video.boothVideos)
    @JoinColumn({
        name: 'video_id',
    })
    video: Video;
}
