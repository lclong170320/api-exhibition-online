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

export interface Exhibition {
    readonly id: number;
    name: string;
    exhibition_code: string;
    category_id: number;
    booth_number: number;
    description: string;
    date_exhibition_start: string;
    date_exhibition_end: string;
    date_input_data_start: string;
    date_input_data_end: string;
    booth_template_ids?: Array<number>;
    readonly booth_ids?: Array<number>;
    readonly space_id?: number;
    readonly organization_booth_id?: number;
}