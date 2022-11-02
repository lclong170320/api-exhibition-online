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

export interface Product {
    readonly id: number;
    position_booth_id: number;
    selected_media_id?: number;
    readonly media_id: number;
    media_data?: string;
    name: string;
    price: number;
    purchase_link: string;
    description: string;
}
