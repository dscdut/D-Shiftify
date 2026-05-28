exports.seed = async knex => {
    await knex('matches').del();

    const jobs = await knex('jobs').where('status', 'open').select('id');
    const candidateRole = await knex('roles')
        .where('name', 'candidate')
        .first();
    const candidates = await knex('users')
        .where('role_id', candidateRole.id)
        .select('id');

    const matches = [];

    candidates.forEach((candidate, candidateIndex) => {
        const numMatches = (candidateIndex % 3) + 1;
        for (let i = 0; i < numMatches && i < jobs.length; i++) {
            const jobIndex = (candidateIndex + i) % jobs.length;
            matches.push({
                id: knex.raw('uuid_generate_v4()'),
                job_id: jobs[jobIndex].id,
                candidate_user_id: candidate.id,
                score: 0.6 + (candidateIndex % 4) * 0.1,
                status:
                    candidateIndex % 3 === 0
                        ? 'pending'
                        : candidateIndex % 3 === 1
                        ? 'matched'
                        : 'rejected',
                created_at: knex.fn.now(),
                updated_at: knex.fn.now(),
                deleted_at: null,
            });
        }
    });

    if (matches.length > 0) {
        await knex('matches').insert(matches);
    }
};
