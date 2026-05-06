const ROLES = [
    { name: 'candidate', description: 'Job candidate with disability' },
    { name: 'recruiter', description: 'Company recruiter' },
    { name: 'admin', description: 'System administrator' },
    {
        name: 'training_center',
        description: 'Training center for people with disabilities',
    },
];

exports.seed = async knex => {
    await knex('roles').del();

    const roles = ROLES.map(role => ({
        id: knex.raw('uuid_generate_v4()'),
        name: role.name,
        description: role.description,
        created_at: knex.fn.now(),
        updated_at: knex.fn.now(),
    }));

    await knex('roles').insert(roles);
};
