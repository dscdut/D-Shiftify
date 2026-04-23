class CreateMatchesTable {
    constructor(knex) {
        this.knex = knex;
    }

    async up() {
        return this.knex.schema.createTable('matches', table => {
            table
                .uuid('id')
                .primary()
                .defaultTo(this.knex.raw('gen_random_uuid()'));
            table
                .uuid('job_id')
                .notNullable()
                .references('id')
                .inTable('jobs');
            table
                .uuid('candidate_user_id')
                .notNullable()
                .references('id')
                .inTable('users');
            table.float('score');
            table.string('status');
            table.timestamps(true, true);
            table.timestamp('deleted_at');

            table.unique(['job_id', 'candidate_user_id']);
        });
    }

    async down() {
        return this.knex.schema.dropTableIfExists('matches');
    }
}

export async function up(knex) {
    return new CreateMatchesTable(knex).up();
}

export async function down(knex) {
    return new CreateMatchesTable(knex).down();
}
