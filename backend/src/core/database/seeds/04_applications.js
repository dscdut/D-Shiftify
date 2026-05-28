class ApplicationsSeeder {
    constructor(knex) {
        this.knex = knex;
    }

    async getCandidateData() {
        const candidate = await this.knex('users')
            .join('roles', 'users.role_id', 'roles.id')
            .join('profiles', 'users.id', 'profiles.user_id')
            .join('cvs', 'profiles.id', 'cvs.profile_id')
            .where('roles.name', 'CANDIDATE')
            .select('cvs.id as cv_id')
            .first();
        return candidate;
    }

    async getJobs() {
        return this.knex('jobs')
            .where('status', 'open')
            .select('id')
            .limit(2);
    }

    async buildApplications(cvId, jobs) {
        return jobs.map((job, index) => ({
            id: this.knex.raw('gen_random_uuid()'),
            job_id: job.id,
            cv_id: cvId,
            status: index === 0 ? 'PENDING' : 'REVIEWED',
            created_at: this.knex.fn.now(),
            updated_at: this.knex.fn.now(),
        }));
    }

    async seed() {
        await this.knex('applications').truncate();

        const candidate = await this.getCandidateData();
        if (!candidate) {
            console.log('No candidate CV found, skipping applications seed');
            return;
        }

        const jobs = await this.getJobs();
        if (jobs.length === 0) {
            console.log('No jobs found, skipping applications seed');
            return;
        }

        const applications = await this.buildApplications(
            candidate.cv_id,
            jobs,
        );
        await this.knex('applications').insert(applications);
    }
}

export async function seed(knex) {
    return new ApplicationsSeeder(knex).seed();
}
