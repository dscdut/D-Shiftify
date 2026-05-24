
export const GetJobsDto = query => ({
    search: query.search,
    job_type: query.job_type,
    work_mode: query.work_mode,
    location: query.location,
    min_salary: query.min_salary ? Number(query.min_salary) : undefined,
    page: query.page ? Number(query.page) : undefined,
    limit: query.limit ? Number(query.limit) : undefined,
});