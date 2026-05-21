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
}

export const JobRepository = new Repository('jobs');