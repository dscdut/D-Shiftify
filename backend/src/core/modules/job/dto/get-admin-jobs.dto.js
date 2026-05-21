export const GetAdminJobsDto = query => ({
    search: query.search,
    status: query.status,
    page: query.page ? Number(query.page) : undefined,
    limit: query.limit ? Number(query.limit) : undefined,
});
