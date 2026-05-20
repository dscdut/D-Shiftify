import { NotFoundException } from "packages/httpException";
import { JobRepository } from "../repository/job.repository";

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
}

export const JobService = new Service();