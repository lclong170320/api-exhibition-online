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

export interface User {
    readonly id: number;
    name: string;
    phone: string;
    email: string;
    password: string;
    role_id: number;
    status: Status;
    enterprise_id: number;
    role: Role;
}

export enum Status {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}

export interface Role {
    id: number;
    name: RoleName;
}

export enum RoleName {
    ADMIN = 'admin',
    USER = 'user',
}
