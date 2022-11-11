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

import { SpaceTemplatePosition } from './space-template-position.dto';

export interface SpaceImage {
    readonly id: number;
    space_id: number;
    space_template_position_id: number;
    readonly space_template_position?: SpaceTemplatePosition;
    select_media_id?: number;
    readonly image_id: number;
    media_data?: string;
}
