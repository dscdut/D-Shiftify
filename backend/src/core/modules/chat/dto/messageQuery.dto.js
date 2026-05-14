export const MessageQueryDto = query => ({
    limit: query.limit ? Number.parseInt(query.limit, 10) : 50,
    before: query.before ?? null,
});
