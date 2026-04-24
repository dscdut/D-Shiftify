class CreateUsersTable {
    constructor(knex) {
        this.knex = knex;
    }

    async up() {
        return this.knex.schema.createTable('users', table => {
            table
                .uuid('id')
                .primary()
                .defaultTo(this.knex.raw('gen_random_uuid()'));
            table.string('email').notNullable().unique();
            table.string('password_hash').notNullable();
            table
                .uuid('role_id')
                .notNullable()
                .references('id')
                .inTable('roles')
                .onDelete('CASCADE')
                .onUpdate('CASCADE');
            table.timestamps(true, true);
            table.timestamp('deleted_at');
        });
    }

    async down() {
        return this.knex.schema.dropTableIfExists('users');
    }
}

export async function up(knex) {
    return new CreateUsersTable(knex).up();
}

export async function down(knex) {
    return new CreateUsersTable(knex).down();
}
