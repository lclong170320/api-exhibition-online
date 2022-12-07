import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { isString, camelCase, mapKeys, pickBy, Dictionary } from 'lodash';

export interface PaginateQuery {
    page?: number;
    limit?: number;
    sortBy?: [string, string][];
    searchBy?: string[];
    search?: string;
    field?: string[];
    filter?: { [column: string]: string | string[] };
    populate?: string[];
    withDeleted?: boolean;
}

export const Paginate = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext): PaginateQuery => {
        const request: Request = ctx.switchToHttp().getRequest();
        const { query } = request;

        const sortBy: [string, string][] = [];
        const searchBy: string[] = [];
        const populate: string[] = [];
        const field: string[] = [];
        let withDeleted = false;
        let filter: { [column: string]: string | string[] } = {};

        if (query.sort_by) {
            const params = !Array.isArray(query.sort_by)
                ? [query.sort_by]
                : query.sort_by;
            for (const param of params) {
                if (isString(param)) {
                    const items = param.split(':');
                    items[0] = camelCase(items[0]);
                    items[1] = items[1].toUpperCase();
                    if (items.length === 2) {
                        sortBy.push(items as [string, string]);
                    }
                }
            }
        }

        if (query.withDeleted === 'true') {
            withDeleted = true;
        }

        if (query.searchBy) {
            const params = !Array.isArray(query.searchBy)
                ? [query.searchBy]
                : query.searchBy;
            for (const param of params) {
                if (isString(param)) {
                    searchBy.push(param);
                }
            }
        }

        if (query.populate) {
            const params = !Array.isArray(query.populate)
                ? [query.populate]
                : query.populate;

            for (const param of params) {
                if (isString(param)) {
                    if (param.includes('.')) {
                        const subParam = param.split('.');
                        const subParamConvert = subParam.map((value) =>
                            camelCase(value),
                        );

                        populate.push(subParamConvert.join('.'));
                    } else {
                        populate.push(camelCase(param));
                    }
                }
            }
        }

        if (query.field) {
            const params = !Array.isArray(query.field)
                ? [query.field]
                : query.field;

            for (const param of params) {
                if (isString(param)) {
                    if (param.includes('.')) {
                        const subParam = param.split('.');
                        const subParamConvert = subParam.map((value) =>
                            camelCase(value),
                        );

                        field.push(subParamConvert.join('.'));
                    } else {
                        field.push(camelCase(param));
                    }
                }
            }
        }

        if (query.filter) {
            const params = !Array.isArray(query.filter)
                ? [query.filter]
                : query.filter;

            for (const param of params) {
                if (isString(param)) {
                    const subParam = param.split(':');
                    const columnName = subParam[0];
                    const valueName = subParam.splice(1, 2).join(':');

                    if (columnName.includes('.')) {
                        const subColunmName = columnName.split('.');
                        const subcolumnNameConvert = subColunmName.map(
                            (value) => camelCase(value),
                        );
                        const columnNameConvert =
                            subcolumnNameConvert.join('.');

                        Object.assign(filter, {
                            [columnNameConvert]: valueName,
                        });
                    } else {
                        Object.assign(filter, {
                            [columnName]: valueName,
                        });
                    }
                }
            }
        } else {
            filter = mapKeys(
                pickBy(
                    query,
                    (param, name) =>
                        name.includes('filter.') &&
                        (isString(param) ||
                            (Array.isArray(param) &&
                                (param as any[]).every((p) => isString(p)))),
                ) as Dictionary<string | string[]>,
                (_param, name) => {
                    const columnName = name.replace('filter.', '');
                    const columnSplit = columnName.split('.');
                    const columnCamelCase = columnSplit.map((value) =>
                        camelCase(value),
                    );
                    return columnCamelCase.join('.');
                },
            );
        }

        return {
            page: query.page ? parseInt(query.page.toString(), 10) : 1,
            limit: query.limit ? parseInt(query.limit.toString(), 10) : 10,
            sortBy: sortBy.length ? sortBy : undefined,
            search: query.search ? query.search.toString() : undefined,
            searchBy: searchBy.length ? searchBy : undefined,
            filter: Object.keys(filter).length ? filter : undefined,
            populate: populate.length ? populate : [],
            field: field.length ? field : [],
            withDeleted: withDeleted,
        };
    },
);
