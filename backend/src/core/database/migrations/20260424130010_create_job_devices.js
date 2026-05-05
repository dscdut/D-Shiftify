const tableName = 'job_devices';

exports.up = async knex => {
    await knex.schema.createTable(tableName, table => {
        table
            .uuid('job_id')
            .notNullable()
            .references('id')
            .inTable('jobs')
            .onDelete('CASCADE');
        table
            .uuid('device_id')
            .notNullable()
            .references('id')
            .inTable('assistive_devices')
            .onDelete('CASCADE');
        table.timestamps(false, true);

        table.unique(['job_id', 'device_id']);
        table.index('job_id');
        table.index('device_id');
    });

    await knex.raw(`
        CREATE TRIGGER update_timestamp
        BEFORE UPDATE ON ${tableName}
        FOR EACH ROW
        EXECUTE PROCEDURE update_timestamp();
    `);
};

exports.down = knex => knex.schema.dropTable(tableName);
