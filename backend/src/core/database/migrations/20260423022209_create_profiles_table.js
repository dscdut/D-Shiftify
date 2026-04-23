class CreateProfilesTable {
    constructor(knex) {
        this.knex = knex;
    }

    async up() {
        return this.knex.schema.createTable('profiles', table => {
            table
                .uuid('id')
                .primary()
                .defaultTo(this.knex.raw('gen_random_uuid()'));
            table
                .uuid('user_id')
                .notNullable()
                .unique()
                .references('id')
                .inTable('users');
            table.string('full_name');
            table.date('dob');
            table.string('gender');
            table.string('phone');
            table.string('disability_status');
            table.timestamps(true, true);
            table.timestamp('deleted_at');
        });
    }

    async down() {
        return this.knex.schema.dropTableIfExists('profiles');
    }
}

export async function up(knex) {
    return new CreateProfilesTable(knex).up();
}

export async function down(knex) {
    return new CreateProfilesTable(knex).down();
}
