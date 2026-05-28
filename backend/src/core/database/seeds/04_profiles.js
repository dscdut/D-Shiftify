exports.seed = async knex => {
    await knex('profiles').del();

    const candidateRole = await knex('roles')
        .where('name', 'candidate')
        .first();
    const candidates = await knex('users')
        .where('role_id', candidateRole.id)
        .select('id');

    const profiles = candidates.map((user, index) => ({
        id: knex.raw('uuid_generate_v4()'),
        user_id: user.id,
        full_name: `Candidate ${index + 1}`,
        dob: new Date(1990 + index, index % 12, 15),
        gender: index % 2 === 0 ? 'male' : 'female',
        phone: `090${1000000 + index}`,
        disability_status:
            index % 3 === 0
                ? 'visual_impairment'
                : index % 3 === 1
                ? 'hearing_impairment'
                : 'mobility_impairment',
        created_at: knex.fn.now(),
        updated_at: knex.fn.now(),
        deleted_at: null,
    }));

    await knex('profiles').insert(profiles);
};
