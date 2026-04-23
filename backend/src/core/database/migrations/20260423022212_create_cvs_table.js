class CreateCvsTable {
    constructor(knex) {
        this.knex = knex;
    }

    async up() {
        return this.knex.schema.createTable('cvs', table => {
            table
                .uuid('id')
                .primary()
                .defaultTo(this.knex.raw('gen_random_uuid()'));
            table
                .uuid('profile_id')
                .notNullable()
                .references('id')
                .inTable('profiles');
            table.string('job_type');
            table.string('work_mode');
            table.string('mobility');
            table.string('expected_job');
            table.jsonb('skills');
            table.jsonb('conditions');
            table.jsonb('experiences');
            table.jsonb('certificates');
            table.timestamps(true, true);
            table.timestamp('deleted_at');
        });
    }

    async down() {
        return this.knex.schema.dropTableIfExists('cvs');
    }
}

export async function up(knex) {
    return new CreateCvsTable(knex).up();
}

export async function down(knex) {
    return new CreateCvsTable(knex).down();
}
