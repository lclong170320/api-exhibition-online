/**
 * COMPAON API
 * API definition for COMPAON
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: compaon@dalavina.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { BoothProject } from './booth-project.dto';
import { BoothVideo } from './booth-video.dto';
import { BoothImage } from './booth-image.dto';
import { LiveStream } from './live-stream.dto';
import { BoothProduct } from './booth-product.dto';
import { Exhibition } from './exhibition.dto';

export interface Booth {
    readonly id: number;
    readonly created_by: number;
    enterprise_id: number;
    location_id?: number;
    booth_template_id?: number;
    live_streams?: Array<LiveStream>;
    booth_images?: Array<BoothImage>;
    booth_videos?: Array<BoothVideo>;
    booth_projects?: Array<BoothProject>;
    booth_products?: Array<BoothProduct>;
    exhibition?: Exhibition;
}
