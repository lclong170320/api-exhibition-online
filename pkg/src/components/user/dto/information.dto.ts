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

export interface Information {
    readonly id: number;
    name: string;
    user_id: number;
    address?: string;
    email?: string;
    media_data?: string;
    selected_media_id?: number;
    readonly media_id?: number;
}
