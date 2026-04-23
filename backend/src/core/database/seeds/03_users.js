const bcrypt = require('bcrypt');

const USERS = [
    { email: 'admin@shiftify.com', role: 'admin' },
    { email: 'candidate@example.com', role: 'candidate' },
    { email: 'recruiter@example.com', role: 'recruiter' },
];

const DEFAULT_PASSWORD = 'password123';

class UsersSeeder {
    constructor(knex) {
        this.knex = knex;
    }

    async getRoleMap() {
        const roles = await this.knex('roles').select('id', 'name');
        return roles.reduce((map, role) => {
            map[role.name] = role.id;
            return map;
        }, {});
    }

    async buildUsers(roleMap, hashedPassword) {
        return USERS.map(user => ({
            id: this.knex.raw('gen_random_uuid()'),
            email: user.email,
            password_hash: hashedPassword,
            role_id: roleMap[user.role],
            created_at: this.knex.fn.now(),
            updated_at: this.knex.fn.now(),
        }));
    }

    async seed() {
        await this.knex('users').del();

        const roleMap = await this.getRoleMap();
        const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);
        const users = await this.buildUsers(roleMap, hashedPassword);

        await this.knex('users').insert(users);
    }
}

export async function seed(knex) {
    return new UsersSeeder(knex).seed();
}
