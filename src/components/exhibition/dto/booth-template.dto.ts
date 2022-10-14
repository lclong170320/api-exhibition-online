import { PositionBooth } from './position-booth.dto';
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
// eslint-disable-next-line @typescript-eslint/no-namespace
export interface BoothTemplate {
    readonly id: number;
    readonly created_by: number;
    readonly created_date: string;
    model_data: string;
    thumbnail_data: string;
    name: string;
    readonly model_id?: number;
    readonly thumbnail_id?: number;
    position_booths?: Array<PositionBooth>;
}
