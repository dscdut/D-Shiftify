const tableName = 'companies';

exports.up = async knex => {
    await knex.schema.createTable(tableName, table => {
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table
            .uuid('user_id')
            .unique()
            .notNullable()
            .references('id')
            .inTable('users')
            .onDelete('CASCADE');
        table.string('name').notNullable();
        table.string('slogan');
        table.string('phone').unique();
        table.string('email').notNullable().unique();
        table.string('website');
        table.string('industry');
        table.string('tax_code');
        table.string('address');
        table.decimal('latitude', 10, 8);
        table.decimal('longitude', 11, 8);
        table.text('policy_for_disabled');
        table.text('experience_with_disabled');
        table.string('license_file');
        table.string('logo_url');
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
