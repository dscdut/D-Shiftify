import { NotFoundException } from "packages/httpException";
import { ForbiddenException } from "packages/httpException/ForbiddenException";
import { JobRepository } from "../repository/job.repository";
import connection, { getTransaction } from "core/database";

class Service {
    constructor() {
        this.jobRepository = JobRepository;
    }

    async getJobById(jobId) {
        const job = await this.jobRepository.getJobById(jobId);
        if (!job) {
            throw new NotFoundException('Job not found');
        }
        return job;
    }

    async deleteJobById(jobId, userId) {
        const job = await this.jobRepository.getJobById(jobId);
        if (!job) {
            throw new NotFoundException('Job not found');
        }

        const company = await connection('companies')
            .where('user_id', userId)
            .whereNull('deleted_at')
            .first();

        if (!company || job.company_id !== company.id) {
            throw new ForbiddenException('You do not have permission to delete this job');
        }

        const trx = await getTransaction();
        try {
            await this.jobRepository.update(
                jobId,
                {
                    deleted_at: new Date(),
                    updated_at: new Date(),
                },
                trx,
            );
            await trx.commit();
        } catch (error) {
            await trx.rollback();
            throw error;
        }

        return {
            message: 'Job deleted successfully',
        };
    }
}

export const JobService = new Service();