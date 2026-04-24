// @ts-check
/**
 * Create user_training_centers table
 */
const tableName = 'user_training_centers';

exports.up = async (knex) => {
    await knex.schema.createTable(tableName, (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table.uuid('user_id').notNullable()
            .references('id').inTable('users')
            .onDelete('CASCADE');
        table.uuid('center_id').notNullable()
            .references('id').inTable('training_centers')
            .onDelete('CASCADE');
        table.timestamp('enrolled_at');
        table.specificType('status', 'enrollment_status');
        table.timestamps(false, true);

        table.unique(['user_id', 'center_id']);
    });

    await knex.raw(`
        CREATE TRIGGER update_timestamp
        BEFORE UPDATE ON ${tableName}
        FOR EACH ROW
        EXECUTE PROCEDURE update_timestamp();
    `);
};

exports.down = (knex) => knex.schema.dropTable(tableName);
