// @ts-check
/**
 * Create cvs table
 */
const tableName = 'cvs';

exports.up = async (knex) => {
    await knex.schema.createTable(tableName, (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table.uuid('profile_id').notNullable()
            .references('id').inTable('profiles')
            .onDelete('CASCADE');
        table.string('job_type');
        table.string('work_mode');
        table.string('mobility');
        table.string('expected_job');
        table.jsonb('skills');
        table.jsonb('conditions');
        table.jsonb('experiences');
        table.jsonb('certificates');
        table.timestamps(false, true);
        table.dateTime('deleted_at').defaultTo(null);
    });

    await knex.raw(`
        CREATE TRIGGER update_timestamp
        BEFORE UPDATE ON ${tableName}
        FOR EACH ROW
        EXECUTE PROCEDURE update_timestamp();
    `);
};

exports.down = (knex) => knex.schema.dropTable(tableName);
