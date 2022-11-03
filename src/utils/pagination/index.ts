import { PaginateQuery } from '@/decorators/paginate.decorator';
import { isEmpty, isNumber, isString } from 'lodash';
import {
    Equal,
    FindManyOptions,
    FindOptionsOrder,
    FindOptionsWhere,
    LessThan,
    LessThanOrEqual,
    Like,
    MoreThan,
    MoreThanOrEqual,
    Repository,
} from 'typeorm';

export interface Option {
    searchableColumns?: string[];
    sortableColumns?: string[];
    filterableColumns?: string[];
    populatableColumns?: string[];
    defaultSortBy?: string[][];
}

export async function paginate<T>(
    query: PaginateQuery,
    repository: Repository<T>,
    option: Option,
) {
    const findOptions: FindManyOptions<T> = {};
    findOptions.take = isNumber(query.limit) ? query.limit : 10;
    findOptions.skip =
        isNumber(query.page) && isNumber(query.limit)
            ? (query.page - 1) * query.limit
            : 1;
    findOptions.order = parseDefaultSortBy(option.defaultSortBy);
    findOptions.relations = parsePopulate(
        query.populate,
        option.populatableColumns,
    );
    const whereClause = parseWhereClause(
        parseSearch(query.search, option.searchableColumns),
        parseFilter(query.filter, option.filterableColumns),
    );
    if (!isEmpty(whereClause)) {
        findOptions.where = whereClause;
    }
    const [data, total] = await repository.findAndCount(findOptions);

    let sortedData = data;
    const sortBy = parseSortBy(query.sortBy, option.sortableColumns);
    sortBy.forEach((item) => {
        sortedData = data.sort((i1, i2) => {
            type ObjectKey = keyof typeof i1;
            if (i1[item[0] as ObjectKey] === i2[item[0] as ObjectKey]) {
                return 0;
            }
            if (item[1] === 'ASC') {
                return i1[item[0] as ObjectKey] < i2[item[0] as ObjectKey]
                    ? -1
                    : 1;
            }
            return i1[item[0] as ObjectKey] > i2[item[0] as ObjectKey] ? -1 : 1;
        });
    });

    return [sortedData, total] as [T[], number];
}

function parseSortBy(
    sortBy: [string, string][],
    sortableColumns: string[],
): [string, string][] {
    const result: [string, string][] = [];
    if (sortBy && sortableColumns) {
        for (const order of sortBy) {
            if (
                sortableColumns.includes(order[0]) &&
                ['ASC', 'DESC'].includes(order[1])
            ) {
                result.push(order);
            }
        }
    }

    return result;
}

function parseDefaultSortBy<T>(defaultSortBy: string[][]) {
    const result: FindOptionsOrder<T> = {};
    if (defaultSortBy && defaultSortBy.length) {
        defaultSortBy.forEach((value) => {
            Object.assign(result, {
                [value[0]]: value[1],
            });
        });
    }
    return result;
}

function parseFilter<T>(
    filter: { [column: string]: string | string[] },
    filterableColumns: string[],
) {
    const allowedOperator = ['$eq', '$lt', '$lte', '$gt', '$gte'];
    const result: FindOptionsWhere<T> = {};
    if (filter && filterableColumns) {
        for (const column in filter) {
            if (isString(filter[column])) {
                const valueFilter = filter[column] as string;
                if (valueFilter.includes(':')) {
                    const [operator, value] = valueFilter.split(':');
                    if (
                        filterableColumns.includes(column) &&
                        allowedOperator.includes(operator) &&
                        value
                    ) {
                        switch (operator) {
                            case '$eq':
                                Object.assign(result, {
                                    [column]: Equal(value),
                                });
                                break;
                            case '$lt':
                                Object.assign(result, {
                                    [column]: LessThan(value),
                                });
                                break;
                            case '$lte':
                                Object.assign(result, {
                                    [column]: LessThanOrEqual(value),
                                });
                                break;
                            case '$gt':
                                Object.assign(result, {
                                    [column]: MoreThan(value),
                                });
                                break;
                            case '$gte':
                                Object.assign(result, {
                                    [column]: MoreThanOrEqual(value),
                                });
                                break;
                            default:
                                break;
                        }
                    }
                } else {
                    if (filterableColumns.includes(column) && valueFilter) {
                        Object.assign(result, {
                            [column]: valueFilter,
                        });
                    }
                }
            }
        }
    }

    return result;
}

function parseSearch<T>(searchText: string, searchableColumns: string[]) {
    const result: FindOptionsWhere<T> = {};
    if (searchText && searchableColumns) {
        searchableColumns.forEach((column) => {
            Object.assign(result, {
                [column]: Like(`%${searchText}%`),
            });
        });
    }

    return result;
}

function parsePopulate(populate: string[], populatableColumns: string[]) {
    const result: string[] = [];
    if (populate && populatableColumns) {
        populate.forEach((column) => {
            if (populatableColumns.includes(column)) {
                result.push(column);
            }
        });
    }
    return result;
}

function parseWhereClause<T>(
    searchClauses: FindOptionsWhere<T>,
    filterClauses: FindOptionsWhere<T>,
) {
    const result: FindOptionsWhere<T>[] = [];
    if (isEmpty(searchClauses) && isEmpty(filterClauses)) {
        return [];
    }

    if (isEmpty(searchClauses)) {
        return [filterClauses];
    }

    for (const [searchKey, searchValue] of Object.entries(searchClauses)) {
        if (searchKey && searchValue) {
            result.push({ [searchKey]: searchValue, ...filterClauses });
        }
    }

    return result;
}
