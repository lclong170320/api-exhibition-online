import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Booking } from './booking.entity';
import { BoothImage } from './booth-image.entity';
import { BoothProduct } from './booth-product.entity';
import { BoothProject } from './booth-project.entity';
import { BoothTemplate } from './booth-template.entity';
import { BoothVideo } from './booth-video.entity';
import { Exhibition } from './exhibition.entity';
import { LiveStream } from './live-stream.entity';
import { Location } from './location.entity';

@Entity({ name: 'booth' })
export class Booth {
    // table columns
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'enterprise_id' })
    enterpriseId: number;

    @Column({ name: 'created_by' })
    createdBy: number;

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
    @OneToMany(() => BoothProduct, (boothProduct) => boothProduct.booth)
    boothProducts: BoothProduct[];

    @OneToMany(() => BoothProject, (boothProject) => boothProject.booth)
    boothProjects: BoothProject[];

    @OneToMany(() => BoothImage, (boothImage) => boothImage.booth)
    boothImages: BoothImage[];

    @OneToMany(() => BoothVideo, (boothVideo) => boothVideo.booth)
    boothVideos: BoothVideo[];

    @OneToOne(() => Location, (location) => location.booth)
    @JoinColumn({
        name: 'location_id',
    })
    location: Location;

    @ManyToOne(() => Exhibition, (exhibition) => exhibition.booths, {
        nullable: false,
    })
    @JoinColumn({
        name: 'exhibition_id',
    })
    exhibition: Exhibition;

    @ManyToOne(() => BoothTemplate, (boothTemplate) => boothTemplate.booths, {
        nullable: false,
    })
    @JoinColumn({
        name: 'booth_template_id',
    })
    boothTemplate: BoothTemplate;

    @OneToMany(() => LiveStream, (liveStream) => liveStream.booth)
    liveStreams: LiveStream[];

    @OneToMany(() => Booking, (booking) => booking.booth)
    booking: Booking[];
}
