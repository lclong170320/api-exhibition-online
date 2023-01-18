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
import { Status } from '@/components/exhibition/entities/exhibition.entity';

export interface StatisticOfExhibitions {
    id: number;
    exhibition_name: string;
    category_id: number;
    view: number;
    total_enterprise: number;
    total_booth: number;
    status: Status;
}