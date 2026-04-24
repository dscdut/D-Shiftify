class CreateRefreshTokensTable {
    constructor(knex) {
        this.knex = knex;
    }

    async up() {
        return this.knex.schema.createTable('refresh_tokens', table => {
            table
                .uuid('id')
                .primary()
                .defaultTo(this.knex.raw('gen_random_uuid()'));
            table
                .uuid('user_id')
                .notNullable()
                .onDelete('CASCADE')
                .references('id')
                .inTable('users');
            table.string('token').notNullable().unique();
            table.timestamp('expires_at').notNullable();
            table.boolean('revoked').defaultTo(false);
            table.timestamps(true, true);
            table.index('user_id');
        });
    }

    async down() {
        return this.knex.schema.dropTableIfExists('refresh_tokens');
    }
}

export async function up(knex) {
    return new CreateRefreshTokensTable(knex).up();
}

export async function down(knex) {
    return new CreateRefreshTokensTable(knex).down();
}
