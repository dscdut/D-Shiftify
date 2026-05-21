export const GetRecruiterJobsDto = query => ({
    status: query.status,
    page: query.page ? Number(query.page) : undefined,
    limit: query.limit ? Number(query.limit) : undefined,
});
