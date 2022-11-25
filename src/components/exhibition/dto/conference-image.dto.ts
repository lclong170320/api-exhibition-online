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

import { ConferenceTemplatePosition } from './conference-template-position.dto';

export interface ConferenceImage {
    readonly id: number;
    conference_id: number;
    readonly conference_template_position?: ConferenceTemplatePosition;
    conference_template_position_id: number;
    select_media_id?: number;
    readonly image_id: number;
    media_data?: string;
}
