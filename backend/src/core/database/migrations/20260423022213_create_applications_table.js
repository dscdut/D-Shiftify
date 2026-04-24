class CreateApplicationsTable {
    constructor(knex) {
        this.knex = knex;
    }

    async up() {
        return this.knex.schema.createTable('applications', table => {
            table
                .uuid('id')
                .primary()
                .defaultTo(this.knex.raw('gen_random_uuid()'));
            table.uuid('job_id').notNullable().references('id').inTable('jobs');
            table.uuid('cv_id').notNullable().references('id').inTable('cvs');
            table
                .enu('status', ['PENDING', 'REVIEWED', 'ACCEPTED', 'REJECTED'])
                .notNullable()
                .defaultTo('PENDING');
            table.timestamps(true, true);
            table.timestamp('deleted_at');

            table.unique(['job_id', 'cv_id']);

            table.index('job_id');
            table.index('cv_id');
        });
    }

    async down() {
        return this.knex.schema.dropTableIfExists('applications');
    }
}

export async function up(knex) {
    return new CreateApplicationsTable(knex).up();
}

export async function down(knex) {
    return new CreateApplicationsTable(knex).down();
}
