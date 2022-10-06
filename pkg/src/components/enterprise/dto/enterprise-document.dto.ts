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

export interface EnterpriseDocument {
    readonly id?: number;
    title: string;
    content: string;
    is_profile: boolean;
    readonly media_id?: number;
    selected_media_id?: number;
    media_data?: string;
}
