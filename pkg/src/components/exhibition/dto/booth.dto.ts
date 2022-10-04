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
import { BoothData } from './booth-data.dto';

export interface Booth {
    readonly id: number;
    booth_template_id: number;
    readonly user_id: number;
    name: string;
    datas: Array<BoothData>;
}