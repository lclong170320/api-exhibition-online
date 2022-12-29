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

export interface BoothProject {
    readonly id: number;
    readonly view: number;
    readonly like: number;
    readonly image_id: number;
    selected_media_id?: number;
    media_data?: string;
    project_id?: number;
    title: string;
    description: string;
    booth_template_position_id?: number;
}
