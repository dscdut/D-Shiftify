const tableName = 'profiles';

exports.up = async knex => {
    await knex.schema.createTable(tableName, table => {
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table
            .uuid('user_id')
            .notNullable()
            .unique()
            .references('id')
            .inTable('users')
            .onDelete('CASCADE');
        table.string('full_name');
        table.date('dob');
        table.string('gender');
        table.string('phone');
        table.string('disability_status');
        table.timestamps(false, true);
        table.dateTime('deleted_at').defaultTo(null);

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
