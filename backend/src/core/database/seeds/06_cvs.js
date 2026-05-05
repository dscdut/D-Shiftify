exports.seed = async knex => {
    await knex('cvs').del();

    const profiles = await knex('profiles').select('id');

    const cvs = profiles.map((profile, index) => ({
        id: knex.raw('uuid_generate_v4()'),
        profile_id: profile.id,
        job_type:
            index % 3 === 0
                ? 'full_time'
                : index % 3 === 1
                ? 'part_time'
                : 'contract',
        work_mode: index % 2 === 0 ? 'remote' : 'hybrid',
        mobility: index % 3 === 0 ? 'limited' : 'full',
        expected_job:
            index % 3 === 0
                ? 'Software Developer'
                : index % 3 === 1
                ? 'Customer Service'
                : 'Data Entry',
        skills: JSON.stringify([
            { name: 'Communication', level: 'advanced' },
            { name: 'Problem Solving', level: 'intermediate' },
        ]),
        conditions: JSON.stringify({
            accessible_workspace: true,
            flexible_hours: index % 2 === 0,
        }),
        experiences: JSON.stringify([
            {
                company: 'Previous Company',
                position: 'Junior Position',
                duration: '2 years',
            },
        ]),
        certificates: JSON.stringify([
            { name: 'Certificate of Completion', issuer: 'Training Center' },
        ]),
        custom_sections: JSON.stringify({
            achievements: ['Achievement 1', 'Achievement 2'],
        }),
        created_at: knex.fn.now(),
        updated_at: knex.fn.now(),
        deleted_at: null,
    }));

    await knex('cvs').insert(cvs);
};
