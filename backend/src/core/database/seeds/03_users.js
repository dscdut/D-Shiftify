const bcrypt = require('bcrypt');

const USERS = [
    { email: 'admin@shiftify.com', role: 'admin' },
    { email: 'candidate1@example.com', role: 'candidate' },
    { email: 'candidate2@example.com', role: 'candidate' },
    { email: 'recruiter1@example.com', role: 'recruiter' },
    { email: 'recruiter2@example.com', role: 'recruiter' },
    { email: 'training@example.com', role: 'training_center' },
];

const DEFAULT_PASSWORD = 'password123';

exports.seed = async knex => {
    await knex('users').del();

    const roles = await knex('roles').select('id', 'name');
    const roleMap = roles.reduce((map, role) => {
        map[role.name] = role.id;
        return map;
    }, {});

    const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);

    const users = USERS.map(user => ({
        id: knex.raw('uuid_generate_v4()'),
        email: user.email,
        password_hash: hashedPassword,
        role_id: roleMap[user.role],
        created_at: knex.fn.now(),
        updated_at: knex.fn.now(),
        deleted_at: null,
    }));

    await knex('users').insert(users);
};
