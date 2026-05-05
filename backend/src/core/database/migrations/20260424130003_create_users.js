// @ts-check
/**
 * Create users table
 */
const tableName = 'users';

exports.up = async (knex) => {
    await knex.schema.createTable(tableName, (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table.string('email').unique().notNullable();
        table.string('password_hash').notNullable();
        table.uuid('role_id').notNullable()
            .references('id').inTable('roles')
            .onDelete('RESTRICT');
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
