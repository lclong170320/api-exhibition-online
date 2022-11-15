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
import { SpaceTemplateLocation } from './space-template-location.dto';
import { SpaceTemplatePosition } from './space-template-position.dto';
import { Space } from './space.dto';

export interface SpaceTemplate {
    readonly id: number;
    name: string;
    readonly created_by: number;
    readonly model_id: number;
    model_data: string;
    readonly thumbnail_id: number;
    thumbnail_data: string;
    readonly map_id: number;
    map_data: string;
    created_date: string;
    space_template_positions?: Array<SpaceTemplatePosition>;
    space_template_locations?: Array<SpaceTemplateLocation>;
    spaces?: Array<Space>;
}
