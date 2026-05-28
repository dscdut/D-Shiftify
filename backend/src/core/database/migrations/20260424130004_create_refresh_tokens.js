const tableName = 'refresh_tokens';

exports.up = async knex => {
    await knex.schema.createTable(tableName, table => {
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table
            .uuid('user_id')
            .notNullable()
            .references('id')
            .inTable('users')
            .onDelete('CASCADE');
        table.string('token').notNullable().unique();
        table.timestamp('expires_at').notNullable();
        table.boolean('revoked').defaultTo(false);
        table.timestamps(false, true);

        table.index('user_id');
    });

    await knex.raw(`
        CREATE TRIGGER update_timestamp
        BEFORE UPDATE ON ${tableName}
        FOR EACH ROW
        EXECUTE PROCEDURE update_timestamp();
    `);
};

exports.down = knex => knex.schema.dropTable(tableName);
