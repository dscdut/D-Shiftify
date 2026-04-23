const ROLES = [
    { name: 'candidate', description: 'Job candidate with disability' },
    { name: 'recruiter', description: 'Company recruiter' },
    { name: 'admin', description: 'System administrator' },
    {
        name: 'training_center',
        description: 'Training center for people with disabilities',
    },
];

class RolesSeeder {
    constructor(knex) {
        this.knex = knex;
    }

    buildRoles() {
        return ROLES.map(role => ({
            id: this.knex.raw('gen_random_uuid()'),
            name: role.name,
            description: role.description,
            created_at: this.knex.fn.now(),
            updated_at: this.knex.fn.now(),
        }));
    }

    async seed() {
        await this.knex('roles').del();
        await this.knex('roles').insert(this.buildRoles());
    }
}

export async function seed(knex) {
    return new RolesSeeder(knex).seed();
}
