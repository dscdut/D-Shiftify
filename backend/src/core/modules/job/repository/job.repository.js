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
            .where('status', 'open')
            .whereNull('deleted_at');

        if (filters.search) {
            query.where('title', 'ilike', `%${filters.search}%`);
        }
        if (filters.job_type) {
            query.where('job_type', filters.job_type);
        }
        if (filters.work_mode) {
            query.where('work_mode', filters.work_mode);
        }
        if (filters.location) {
            query.where('location', 'ilike', `%${filters.location}%`);
        }
        if (filters.min_salary) {
            query.where('salary_min', '>=', filters.min_salary);
        }

        return query;
    }

    getJobs(filters, offset, limit) {
        return this.#buildGetJobsQuery(filters)
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
                'created_at',
                'updated_at'
            )
            .orderBy('created_at', 'desc')
            .limit(limit)
            .offset(offset);
    }

    async countJobs(filters) {
        const result = await this.#buildGetJobsQuery(filters).count('* as total').first();
        return parseInt(result.total, 10) || 0;
    }
}

export const JobRepository = new Repository('jobs');