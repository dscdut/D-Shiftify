import { DataRepository } from 'packages/restBuilder/core/dataHandler/data.repository';

class Repository extends DataRepository {
    getJobById(jobId) {
        return this.query()
            .where('id', jobId)
            .where('status', 'open')
            .whereNull('deleted_at')
            .select(
                'id',
                'company_id',
                'title',
                'job_type',
                'work_mode',
                'experience_required',
                'skills',
                'salary_min',
                'salary_max',
                'location',
                'latitude',
                'longitude',
                'working_time',
                'description',
                'created_at',
                'updated_at',
            )
            .first();
    }

    getJobByIdForRecruiter(jobId) {
        return this.query()
            .where('id', jobId)
            .whereNull('deleted_at')
            .select(
                'id',
                'company_id',
                'title',
                'job_type',
                'work_mode',
                'experience_required',
                'skills',
                'salary_min',
                'salary_max',
                'location',
                'latitude',
                'longitude',
                'working_time',
                'description',
                'status',
                'created_at',
                'updated_at',
            )
            .first();
    }

    updateJobById(jobId, data, trx = null) {
        const queryBuilder = this.query()
            .where('id', jobId)
            .whereNull('deleted_at')
            .update(data);
        if (trx) queryBuilder.transacting(trx);
        return queryBuilder;
    }

    #buildGetJobsQuery(filters) {
        const query = this.query()
            .leftJoin('companies', 'jobs.company_id', 'companies.id')
            .where('jobs.status', 'open')
            .whereNull('jobs.deleted_at');

        if (filters.search) {
            query.where(builder => {
                builder.where('jobs.title', 'ilike', `%${filters.search}%`)
                    .orWhere('companies.name', 'ilike', `%${filters.search}%`);
            });
        }
        if (filters.job_type) {
            query.where('jobs.job_type', filters.job_type);
        }
        if (filters.work_mode) {
            query.where('jobs.work_mode', filters.work_mode);
        }
        if (filters.location) {
            query.where('jobs.location', 'ilike', `%${filters.location}%`);
        }
        if (filters.min_salary) {
            query.where('jobs.salary_min', '>=', filters.min_salary);
        }

        return query;
    }

    getJobs(filters, offset, limit) {
        return this.#buildGetJobsQuery(filters)
            .select(
                'jobs.id',
                'jobs.company_id',
                'jobs.title',
                'jobs.job_type',
                'jobs.work_mode',
                'jobs.experience_required',
                'jobs.skills',
                'jobs.salary_min',
                'jobs.salary_max',
                'jobs.location',
                'jobs.latitude',
                'jobs.longitude',
                'jobs.working_time',
                'jobs.created_at',
                'jobs.updated_at',
                'companies.name as company_name',
                'companies.logo_url as company_logo_url'
            )
            .orderBy('jobs.created_at', 'desc')
            .limit(limit)
            .offset(offset);
    }

    async countJobs(filters) {
        const result = await this.#buildGetJobsQuery(filters).count('jobs.id as total').first();
        return parseInt(result.total, 10) || 0;
    }

    #buildGetAdminJobsQuery(filters) {
        const query = this.query()
            .leftJoin('companies', 'jobs.company_id', 'companies.id')
            .whereNull('jobs.deleted_at');

        if (filters.status) {
            query.where('jobs.status', filters.status);
        }
        if (filters.search) {
            query.where(builder => {
                builder.where('jobs.title', 'ilike', `%${filters.search}%`)
                    .orWhere('companies.name', 'ilike', `%${filters.search}%`);
            });
        }

        return query;
    }

    getAdminJobs(filters, offset, limit) {
        return this.#buildGetAdminJobsQuery(filters)
            .select(
                'jobs.id',
                'jobs.company_id',
                'jobs.title',
                'jobs.job_type',
                'jobs.work_mode',
                'jobs.experience_required',
                'jobs.skills',
                'jobs.salary_min',
                'jobs.salary_max',
                'jobs.location',
                'jobs.latitude',
                'jobs.longitude',
                'jobs.working_time',
                'jobs.status',
                'jobs.created_at',
                'jobs.updated_at',
                'companies.name as company_name',
                'companies.logo_url as company_logo_url'
            )
            .orderBy('jobs.created_at', 'desc')
            .limit(limit)
            .offset(offset);
    }

    async countAdminJobs(filters) {
        const result = await this.#buildGetAdminJobsQuery(filters)
            .count('jobs.id as total')
            .first();
        return parseInt(result.total, 10) || 0;
    }

    #buildGetRecruiterJobsQuery(companyId, filters) {
        const query = this.query()
            .leftJoin('companies', 'jobs.company_id', 'companies.id')
            .where('jobs.company_id', companyId)
            .whereNull('jobs.deleted_at');

        if (filters.status) {
            query.where('jobs.status', filters.status);
        }

        return query;
    }

    getRecruiterJobs(companyId, filters, offset, limit) {
        return this.#buildGetRecruiterJobsQuery(companyId, filters)
            .select(
                'jobs.id',
                'jobs.company_id',
                'jobs.title',
                'jobs.job_type',
                'jobs.work_mode',
                'jobs.experience_required',
                'jobs.skills',
                'jobs.salary_min',
                'jobs.salary_max',
                'jobs.location',
                'jobs.latitude',
                'jobs.longitude',
                'jobs.working_time',
                'jobs.status',
                'jobs.created_at',
                'jobs.updated_at',
                'companies.name as company_name',
                'companies.logo_url as company_logo_url'
            )
            .orderBy('jobs.created_at', 'desc')
            .limit(limit)
            .offset(offset);
    }

    async countRecruiterJobs(companyId, filters) {
        const result = await this.#buildGetRecruiterJobsQuery(companyId, filters)
            .count('jobs.id as total')
            .first();
        return parseInt(result.total, 10) || 0;
    }
}

export const JobRepository = new Repository('jobs');