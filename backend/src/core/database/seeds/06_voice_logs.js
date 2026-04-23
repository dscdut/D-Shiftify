class VoiceLogsSeeder {
    constructor(knex) {
        this.knex = knex;
    }

    async getCandidateUserId() {
        const candidate = await this.knex('users')
            .join('roles', 'users.role_id', 'roles.id')
            .where('roles.name', 'candidate')
            .select('users.id')
            .first();
        return candidate?.id;
    }

    async getJobId() {
        const job = await this.knex('jobs')
            .where('status', 'active')
            .select('id')
            .first();
        return job?.id;
    }

    async buildVoiceLogs(userId, jobId) {
        return [
            {
                id: this.knex.raw('gen_random_uuid()'),
                user_id: userId,
                type: 'job_search',
                source: 'mobile_app',
                reference_id: jobId,
                status: 'completed',
                created_at: this.knex.fn.now(),
                updated_at: this.knex.fn.now()
            },
            {
                id: this.knex.raw('gen_random_uuid()'),
                user_id: userId,
                type: 'application_submit',
                source: 'web_app',
                reference_id: jobId,
                status: 'completed',
                created_at: this.knex.fn.now(),
                updated_at: this.knex.fn.now()
            }
        ];
    }

    async seed() {
        await this.knex('voice_logs').del();

        const userId = await this.getCandidateUserId();
        if (!userId) {
            console.log('No candidate user found, skipping voice_logs seed');
            return;
        }

        const jobId = await this.getJobId();
        if (!jobId) {
            console.log('No job found, skipping voice_logs seed');
            return;
        }

        const voiceLogs = await this.buildVoiceLogs(userId, jobId);
        await this.knex('voice_logs').insert(voiceLogs);
    }
}

export async function seed(knex) {
    return new VoiceLogsSeeder(knex).seed();
}
