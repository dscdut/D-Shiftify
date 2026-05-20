import { DataRepository } from 'packages/restBuilder/core/dataHandler/data.repository';

class Repository extends DataRepository {

    createOne(payload) {

        return this.query()
            .insert(payload)
            .returning([
                'id',
                'job_id as jobId',
                'cv_id as cvId',
                'status',
                'created_at as createdAt',
            ]);
    }

    findById(id , trx = null) {
        const queryBuilder = this.query()
            .join('jobs', 'jobs.id', 'applications.job_id')
            .join('cvs', 'cvs.id', 'applications.cv_id')
            .where('applications.id', id)
            .whereNull('applications.deleted_at')
            .select([
                'applications.id',
                { jobId: 'applications.job_id' },
                { cvId: 'applications.cv_id' },
                'applications.status',
                { createdAt: 'applications.created_at' },
                { jobTitle: 'jobs.title' },
            ])
            .first();
        if (trx) queryBuilder.transacting(trx);
        return queryBuilder;
    }

    getAll(page , size) {
        const offset = (page - 1) * size;
        const query = this.query()
            .join('jobs', 'jobs.id', 'applications.job_id')
            .join('cvs', 'cvs.id', 'applications.cv_id')
            .whereNull('applications.deleted_at')
            .select([
                'applications.id',
                { jobId: 'applications.job_id' },
                { cvId: 'applications.cv_id' },
                'applications.status',
                { createdAt: 'applications.created_at' },
                { jobTitle: 'jobs.title' },
            ]).limit(size).offset(offset);
        return  query;
    }
    getTotalCount() {
        return this.query()
            .whereNull('deleted_at')
            .count('id as total')
            .first()
            .then(result => {
            return result || { total: 0 };
        });
    }

    findByJobAndCv(jobId, cvId) {

        return this.query()
            .whereNull('applications.deleted_at')
            .where({
                job_id: jobId,
                cv_id: cvId,
            })
            .first();
    }

    updateStatus(id, status, trx = null) {

        const queryBuilder = this.query()
            .where('id', '=', id)
            .whereNull('deleted_at')
            .update({
                status,
                updated_at: new Date(),
            })
            .returning([
                'id',
                'job_id as jobId',
                'cv_id as cvId',
                'status',
                'updated_at as updatedAt',
            ]);

        if (trx) {
            queryBuilder.transacting(trx);
        }

        return queryBuilder;
    }


}

export const ApplicationsRepository = new Repository('applications');
