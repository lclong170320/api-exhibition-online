import { PaginateQuery } from '@/decorators/paginate.decorator';
import { isEmpty, isNumber, isString, reduceRight } from 'lodash';
import {
    Equal,
    FindManyOptions,
    FindOptionsOrder,
    FindOptionsWhere,
    FindOptionsSelect,
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
    withDeleted?: boolean;
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
    findOptions.select = parseField(query.field);
    findOptions.order = parseDefaultSortBy(option.defaultSortBy);
    findOptions.relations = parsePopulate(
        query.populate,
        option.populatableColumns,
    );
    findOptions.withDeleted = option.withDeleted;
    const whereClause: FindOptionsWhere<T>[] = parseWhereClause(
        parseSearch(query.search, option.searchableColumns),
        parseFilter(query.filter, option.filterableColumns),
    );
    if (!isEmpty(whereClause)) {
        findOptions.where = whereClause;
    }
    const [data, total] = await repository.findAndCount(findOptions);

    const sortBy = parseSortBy(query.sortBy, option.sortableColumns);
    const sortedData = handleSortData(data, sortBy);

    return [sortedData, total] as [T[], number];
}

function sortData(i1, i2, item) {
    type ObjectKey = keyof typeof i1;
    if (i1[item[0] as ObjectKey] === i2[item[0] as ObjectKey]) {
        return 0;
    }
    if (item[1] === 'ASC') {
        return i1[item[0] as ObjectKey] < i2[item[0] as ObjectKey] ? -1 : 1;
    }
    return i1[item[0] as ObjectKey] > i2[item[0] as ObjectKey] ? -1 : 1;
}

function handleSortData<T>(data: T[], sortBy: [string, string][]) {
    let sortedData = data;
    sortBy.forEach((item) => {
        sortedData = [...data].sort((i1, i2) => sortData(i1, i2, item));
    });

    return sortedData;
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

function handleFilterWithColon<T>(
    valueFilter: string,
    filterableColumns: string[],
    columns: string[],
    column: string,
    result: FindOptionsWhere<T>,
    allowedOperator: string[],
) {
    const [operator, value] = valueFilter.split(':');
    if (
        filterableColumns.includes(column) &&
        allowedOperator.includes(operator) &&
        value
    ) {
        switch (operator) {
            case '$eq':
                Object.assign(
                    result,
                    reduceRight(
                        columns,
                        (memo, arrayValue) => {
                            const obj = {};
                            obj[arrayValue] = memo;
                            return obj;
                        },
                        Equal(value),
                    ),
                );
                break;
            case '$lt':
                Object.assign(
                    result,
                    reduceRight(
                        columns,
                        (memo, arrayValue) => {
                            const obj = {};
                            obj[arrayValue] = memo;
                            return obj;
                        },
                        LessThan(value),
                    ),
                );
                break;
            case '$lte':
                Object.assign(
                    result,
                    reduceRight(
                        columns,
                        (memo, arrayValue) => {
                            const obj = {};
                            obj[arrayValue] = memo;
                            return obj;
                        },
                        LessThanOrEqual(value),
                    ),
                );
                break;
            case '$gt':
                Object.assign(
                    result,
                    reduceRight(
                        columns,
                        (memo, arrayValue) => {
                            const obj = {};
                            obj[arrayValue] = memo;
                            return obj;
                        },
                        MoreThan(value),
                    ),
                );
                break;
            case '$gte':
                Object.assign(
                    result,
                    reduceRight(
                        columns,
                        (memo, arrayValue) => {
                            const obj = {};
                            obj[arrayValue] = memo;
                            return obj;
                        },
                        MoreThanOrEqual(value),
                    ),
                );
                break;
            default:
                break;
        }
    }
}

function hanldeFilterNoColon<T>(
    filterableColumns: string[],
    columns: string[],
    column: string,
    valueFilter: string,
    result: FindOptionsWhere<T>,
) {
    if (filterableColumns.includes(column) && valueFilter) {
        Object.assign(
            result,
            reduceRight(
                columns,
                (memo, arrayValue) => {
                    const obj = {};
                    obj[arrayValue] = memo;
                    return obj;
                },
                Equal(valueFilter),
            ),
        );
    }
}

function parseFilter<T>(
    filter: { [column: string]: string | string[] },
    filterableColumns: string[],
) {
    const allowedOperator = ['$eq', '$lt', '$lte', '$gt', '$gte'];
    const result: FindOptionsWhere<T> = {};
    if (filter && filterableColumns) {
        for (const column in filter) {
            const columns = column.split('.');
            if (isString(filter[column])) {
                const valueFilter = filter[column] as string;
                if (valueFilter.includes(':')) {
                    handleFilterWithColon(
                        valueFilter,
                        filterableColumns,
                        columns,
                        column,
                        result,
                        allowedOperator,
                    );
                } else {
                    hanldeFilterNoColon(
                        filterableColumns,
                        columns,
                        column,
                        valueFilter,
                        result,
                    );
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

function parseField<T>(field: string[]) {
    const result: FindOptionsSelect<T> = {};
    field.forEach((column) => {
        if (column.includes('.')) {
            const subColumn = column.split('.');
            const lastField = {
                id: true,
                createdAt: true,
                updatedAt: true,
                [subColumn[subColumn.length - 1]]: true,
            };
            const subColumnPop = subColumn.slice(0, subColumn.length - 1);
            if (subColumnPop.length === 1) {
                Object.assign(result, {
                    id: true,
                    createdAt: true,
                    updatedAt: true,
                    [subColumnPop[0]]: lastField,
                });
            } else {
                const res = lastField;
                const subColumnShift = subColumn
                    .slice(1, subColumn.length)
                    .reverse();
                subColumnShift.forEach((column, index) => {
                    if (index === 0) {
                        Object.assign(res, {
                            id: true,
                            createdAt: true,
                            updatedAt: true,
                            [column]: { ...lastField },
                        });
                    } else {
                        Object.assign(res, {
                            id: true,
                            createdAt: true,
                            updatedAt: true,
                            [column]: { ...res },
                        });
                        delete res[subColumnShift[index - 1]];
                    }
                });
                Object.assign(result, {
                    id: true,
                    createdAt: true,
                    updatedAt: true,
                    [subColumn[0]]: res,
                });
            }
        } else {
            Object.assign(result, {
                id: true,
                createdAt: true,
                updatedAt: true,
                [column]: true,
            });
        }
    });
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
