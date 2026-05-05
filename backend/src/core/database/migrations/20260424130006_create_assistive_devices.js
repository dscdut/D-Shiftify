exports.up = async knex => {
    await knex.schema.createTable('assistive_devices', table => {
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table.string('name');
        table.timestamps(false, true);
    });

    await knex.raw(`
        CREATE TRIGGER update_timestamp
        BEFORE UPDATE ON assistive_devices
        FOR EACH ROW
        EXECUTE PROCEDURE update_timestamp();
    `);

    await knex.schema.createTable('user_devices', table => {
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table
            .uuid('profile_id')
            .notNullable()
            .references('id')
            .inTable('profiles')
            .onDelete('CASCADE');
        table
            .uuid('device_id')
            .notNullable()
            .references('id')
            .inTable('assistive_devices')
            .onDelete('CASCADE');
        table.timestamps(false, true);

        table.unique(['profile_id', 'device_id']);
        table.index('profile_id');
        table.index('device_id');
    });

    await knex.raw(`
        CREATE TRIGGER update_timestamp
        BEFORE UPDATE ON user_devices
        FOR EACH ROW
        EXECUTE PROCEDURE update_timestamp();
    `);
};

exports.down = async knex => {
    await knex.schema.dropTableIfExists('user_devices');
    await knex.schema.dropTableIfExists('assistive_devices');
};
