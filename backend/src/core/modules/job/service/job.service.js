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

    async createJob(data, userId) {
        const company = await connection('companies')
            .where('user_id', userId)
            .whereNull('deleted_at')
            .first();

        if (!company) {
            throw new ForbiddenException('You must create a company profile before posting a job');
        }

        const { assistive_devices, ...jobData } = data;

        // Stringify skills array of objects for PostgreSQL jsonb column compatibility if present
        if (jobData.skills) {
            jobData.skills = JSON.stringify(jobData.skills);
        }

        const trx = await getTransaction();
        try {
            const [insertedJob] = await this.jobRepository.insert(
                {
                    ...jobData,
                    company_id: company.id,
                },
                trx,
                ['id'],
            );
            const jobId = insertedJob.id || insertedJob;

            // Map assistive devices to the job in the join table
            if (assistive_devices && assistive_devices.length > 0) {
                const jobDevicesRows = assistive_devices.map(deviceId => ({
                    job_id: jobId,
                    device_id: deviceId,
                }));
                await connection('job_devices')
                    .insert(jobDevicesRows)
                    .transacting(trx);
            }

            await trx.commit();
            
            return {
                id: jobId,
                message: 'Job created successfully',
            };
        } catch (error) {
            await trx.rollback();
            throw error;
        }
    }
}

export const JobService = new Service();