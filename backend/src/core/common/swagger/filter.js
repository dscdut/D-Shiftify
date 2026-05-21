import { SwaggerDocument } from '../../../packages/swagger';

export const QueryCriteriaDocument = {
    page: (desc = 'Max page: 100000. Default: 1') => SwaggerDocument.ApiParams({
        name: 'page',
        paramsIn: 'query',
        required: false,
        type: 'int',
        description: desc
    }),
    size: (desc = 'Max size: 100. Default: 50') => SwaggerDocument.ApiParams({
        name: 'size',
        paramsIn: 'query',
        required: false,
        type: 'int',
        description: desc
    }),
    sort: desc => SwaggerDocument.ApiParams({
        name: 'sort',
        paramsIn: 'query',
        required: false,
        type: 'array',
        description: desc
    }),
    filter: desc => SwaggerDocument.ApiParams({
        name: 'filter',
        paramsIn: 'query',
        required: false,
        type: 'array',
        description: desc
    }),
    search: desc => SwaggerDocument.ApiParams({
        name: 'search',
        paramsIn: 'query',
        required: false,
        type: 'string',
        description: desc
    }),
    limit: (desc = 'Max size: 100. Default: 10') => SwaggerDocument.ApiParams({
        name: 'limit',
        paramsIn: 'query',
        required: false,
        type: 'int',
        description: desc
    }),
    job_type: (desc = 'Job type') => SwaggerDocument.ApiParams({
        name: 'job_type',
        paramsIn: 'query',
        required: false,
        type: 'string',
        description: desc
    }),
    work_mode: (desc = 'Work mode (remote, onsite, hybrid)') => SwaggerDocument.ApiParams({
        name: 'work_mode',
        paramsIn: 'query',
        required: false,
        type: 'string',
        description: desc
    }),
    location: (desc = 'Location') => SwaggerDocument.ApiParams({
        name: 'location',
        paramsIn: 'query',
        required: false,
        type: 'string',
        description: desc
    }),
    min_salary: (desc = 'Minimum salary') => SwaggerDocument.ApiParams({
        name: 'min_salary',
        paramsIn: 'query',
        required: false,
        type: 'int',
        description: desc
    })
};

export const DefaultQueryCriteriaDocument = [...Object.values(QueryCriteriaDocument).map(exec => exec())];

export const generateDocBasedOnSchema = schema => {
    if (!schema?.locks?.filters) {
        throw new Error('locks.filters are not existed in schema file. Should be an array');
    }

    if (!schema?.locks?.sorts) {
        throw new Error('locks.sorts are not existed in schema file. Should be an array');
    }

    if (!schema?.searchCriteria) {
        throw new Error('searchCriteria are not existed in schema file. Should be an array');
    }

    return [
        QueryCriteriaDocument.page(),
        QueryCriteriaDocument.size(),
        QueryCriteriaDocument.filter(`Support filter: ${schema.locks.filters.toString()}`),
        QueryCriteriaDocument.sort(`Support sort fields: ${schema.locks.sorts.toString()}`),
        QueryCriteriaDocument.search(`Support search fields: ${schema.searchCriteria.toString()}`)
    ];
};
