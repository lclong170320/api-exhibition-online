import { Injectable } from '@nestjs/common';
import { isString } from 'lodash';
import { FindOptionsOrder, Entity, FindOptionsWhere, Like } from 'typeorm';

@Injectable()
export class QueryHelper {
    parseSortBy(
        sortBy: [string, string][],
        sortableColumns: string[],
    ): FindOptionsOrder<typeof Entity> {
        const result: FindOptionsOrder<typeof Entity> = {};
        if (sortBy) {
            for (const order of sortBy) {
                if (
                    sortableColumns.includes(order[0]) &&
                    ['ASC', 'DESC'].includes(order[1])
                ) {
                    Object.assign(result, {
                        [order[0]]: order[1],
                    });
                }
            }
        }

        if (
            Object.keys(result).length === 0 &&
            Object.getPrototypeOf(result) === Object.prototype
        ) {
            Object.assign(result, {
                createdAt: 'DESC',
            });
        }

        return result;
    }

    parseFilter(filter: { [column: string]: string | string[] }) {
        const allowedOperator = ['$eq'];
        const result: FindOptionsWhere<typeof Entity> = {};
        if (filter) {
            for (const column in filter) {
                if (isString(filter[column])) {
                    const [operator, value] = (filter[column] as string).split(
                        ':',
                    );
                    if (allowedOperator.includes(operator)) {
                        switch (operator) {
                            case '$eq':
                                Object.assign(result, {
                                    [column]: value,
                                });
                                break;
                            default:
                                break;
                        }
                    }
                }
            }
        }

        return result;
    }

    parseSearch(searchText: string, searchableColumns: string[]) {
        const result: FindOptionsWhere<typeof Entity> = {};
        if (searchText) {
            searchableColumns.forEach((column) => {
                Object.assign(result, {
                    [column]: Like(`%${searchText}%`),
                });
            });
        }

        return result;
    }

    parsePopulate(populate: string[], populatableColumns: string[]) {
        const result: string[] = [];
        if (populate) {
            populate.forEach((column) => {
                if (populatableColumns.includes(column)) {
                    result.push(column);
                }
            });
        }
        return result;
    }
}
