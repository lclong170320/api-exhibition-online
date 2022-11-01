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

import { EnterpriseDocument } from './enterprise-document.dto';

export interface Enterprise {
    readonly id: number;
    international_name: string;
    abbreviation: string;
    tax_code: string;
    address: string;
    ceo: string;
    phone: string;
    active_date: string;
    readonly created_by: number;
    readonly created_date: string;
    status: Enterprise.StatusEnum;
    type_of_business: string;
    manager_by: string;
    view_company_online?: string;
    documents?: EnterpriseDocument[];
}
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Enterprise {
    export type StatusEnum = 'active' | 'inactive';
    export const StatusEnum = {
        Active: 'active' as StatusEnum,
        Inactive: 'inactive' as StatusEnum,
    };
}
