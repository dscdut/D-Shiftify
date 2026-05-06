exports.seed = async knex => {
    await knex('user_training_centers').del();

    const candidateRole = await knex('roles')
        .where('name', 'candidate')
        .first();
    const candidates = await knex('users')
        .where('role_id', candidateRole.id)
        .select('id');
    const centers = await knex('training_centers').select('id');

    const userTrainingCenters = [];

    candidates.forEach((candidate, index) => {
        const center = centers[index % centers.length];
        userTrainingCenters.push({
            id: knex.raw('uuid_generate_v4()'),
            user_id: candidate.id,
            center_id: center.id,
            enrolled_at: new Date(2024, index % 12, 1),
            status:
                index % 3 === 0
                    ? 'studying'
                    : index % 3 === 1
                    ? 'completed'
                    : 'dropped',
            created_at: knex.fn.now(),
            updated_at: knex.fn.now(),
        });
    });

    if (userTrainingCenters.length > 0) {
        await knex('user_training_centers').insert(userTrainingCenters);
    }
};
