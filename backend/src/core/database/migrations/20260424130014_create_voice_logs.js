// @ts-check
/**
 * Create voice_logs table
 */
const tableName = 'voice_logs';

exports.up = async (knex) => {
    await knex.schema.createTable(tableName, (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table.uuid('user_id')
            .references('id').inTable('users')
            .onDelete('SET NULL');
        table.string('type');
        table.string('source');
        table.uuid('reference_id');
        table.string('status');
        table.timestamps(false, true);
    });

    await knex.raw(`
        CREATE TRIGGER update_timestamp
        BEFORE UPDATE ON ${tableName}
        FOR EACH ROW
        EXECUTE PROCEDURE update_timestamp();
    `);
};

exports.down = (knex) => knex.schema.dropTable(tableName);
