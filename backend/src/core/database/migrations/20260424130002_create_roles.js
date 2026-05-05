// @ts-check
/**
 * Create roles table
 */
const tableName = 'roles';

exports.up = async (knex) => {
    await knex.schema.createTable(tableName, (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table.string('name').unique().notNullable();
        table.text('description');
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
