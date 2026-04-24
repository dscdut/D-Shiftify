import logger from '@utils/logger.js';

class MatchesSeeder {
    constructor(knex) {
        this.knex = knex;
    }

    async getCandidateUserId() {
        const candidate = await this.knex('users')
            .join('roles', 'users.role_id', 'roles.id')
            .where('roles.name', 'CANDIDATE')
            .select('users.id')
            .first();
        return candidate?.id;
    }

    async getJobs() {
        return this.knex('jobs')
            .where('status', 'ACTIVE')
            .select('id')
            .limit(2);
    }

    async buildMatches(candidateId, jobs) {
        return jobs.map((job, index) => ({
            id: this.knex.raw('gen_random_uuid()'),
            job_id: job.id,
            candidate_user_id: candidateId,
            score: 0.75 + index * 0.1,
            status: index === 0 ? 'MATCHED' : 'PENDING',
            created_at: this.knex.fn.now(),
            updated_at: this.knex.fn.now(),
        }));
    }

    async seed() {
        await this.knex('matches').del();

        const candidateId = await this.getCandidateUserId();
        if (!candidateId) {
            logger.error('No candidate user found, skipping matches seed');
            return;
        }

        const jobs = await this.getJobs();
        if (jobs.length === 0) {
            logger.error('No jobs found, skipping matches seed');
            return;
        }

        const matches = await this.buildMatches(candidateId, jobs);
        await this.knex('matches').insert(matches);
    }
}

export async function seed(knex) {
    return new MatchesSeeder(knex).seed();
}
