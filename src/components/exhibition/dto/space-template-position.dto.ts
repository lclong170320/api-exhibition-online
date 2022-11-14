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

export interface SpaceTemplatePosition {
    readonly id: number;
    position: string;
    type: Type;
}
export enum Type {
    Image = 'image',
    Video = 'video',
}