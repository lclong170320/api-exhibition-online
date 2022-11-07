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
import { Project } from './project.dto';
import { LiveStream } from './live-stream.dto';
import { BoothData } from './booth-data.dto';
import { Product } from './product.dto';

export interface Booth {
    /**
     * The number id booth.
     */
    readonly id: number;
    /**
     * The name category.
     */
    name: string;
    enterprise_id: number;
    readonly created_by: number;
    readonly booth_template_id: number;
    readonly location_status_id: number;
    live_streams: Array<LiveStream>;
    booth_data: Array<BoothData>;
    projects: Array<Project>;
    products: Array<Product>;
}
