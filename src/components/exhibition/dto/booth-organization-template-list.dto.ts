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
import { BoothOrganizationTemplate } from './booth-organization-template.dto';

export interface BoothOrganizationTemplateList {
    /**
     * The number of items to skip before starting to collect the result set.
     */
    page: number;
    /**
     * The number of items to return.
     */
    limit: number;
    total: number;
    booth_organization_templates?: Array<BoothOrganizationTemplate>;
}