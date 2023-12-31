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
import { BoothTemplatePosition } from './booth-template-position.dto';
import { Booth } from './booth.dto';

export interface BoothTemplate {
    readonly id: number;
    readonly created_by: number;
    readonly created_date: string;
    model_data: string;
    thumbnail_data: string;
    name: string;
    type: Type;
    readonly model_id?: number;
    readonly thumbnail_id?: number;
    booths?: Array<Booth>;
    booth_template_positions?: Array<BoothTemplatePosition>;
}

export enum Type {
    PROJECT = 'project',
    PRODUCT = 'product',
}
