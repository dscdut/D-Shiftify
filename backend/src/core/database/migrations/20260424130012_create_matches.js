const tableName = 'matches';

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
            .uuid('candidate_user_id')
            .notNullable()
            .references('id')
            .inTable('users')
            .onDelete('CASCADE');
        table.float('score');
        table.specificType('status', 'match_status');
        table.timestamps(false, true);
        table.dateTime('deleted_at').defaultTo(null);

        table.unique(['job_id', 'candidate_user_id']);
        table.index('job_id');
        table.index('candidate_user_id');
        table.index('status');
        table.index(['status', 'score']);
    });

    await knex.raw(`
        CREATE TRIGGER update_timestamp
        BEFORE UPDATE ON ${tableName}
        FOR EACH ROW
        EXECUTE PROCEDURE update_timestamp();
    `);
};

exports.down = knex => knex.schema.dropTable(tableName);
