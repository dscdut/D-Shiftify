const tableName = 'applications';

exports.up = async knex => {
    await knex.schema.createTable(tableName, table => {
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table
            .uuid('job_id')
            .notNullable()
            .references('id')
            .inTable('jobs')
            .onDelete('CASCADE');
        table
            .uuid('cv_id')
            .notNullable()
            .references('id')
            .inTable('cvs')
            .onDelete('CASCADE');
        table.specificType('status', 'application_status');
        table.timestamps(false, true);
        table.dateTime('deleted_at').defaultTo(null);

        table.unique(['job_id', 'cv_id']);
        table.index('job_id');
        table.index('cv_id');
        table.index('status');
    });

    await knex.raw(`
        CREATE TRIGGER update_timestamp
        BEFORE UPDATE ON ${tableName}
        FOR EACH ROW
        EXECUTE PROCEDURE update_timestamp();
    `);
};

exports.down = knex => knex.schema.dropTable(tableName);
