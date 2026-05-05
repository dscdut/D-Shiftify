// @ts-check
/**
 * Create courses table
 */
const tableName = 'courses';

exports.up = async (knex) => {
    await knex.schema.createTable(tableName, (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table.uuid('center_id').notNullable()
            .references('id').inTable('training_centers')
            .onDelete('CASCADE');
        table.string('title');
        table.specificType('duration_type', 'duration_type');
        table.date('start_date');
        table.date('end_date');
        table.string('mode');
        table.string('certificate_output');
        table.text('description');
        table.timestamps(false, true);
        table.dateTime('deleted_at').defaultTo(null);
    });

    // Add check constraint for date validation
    await knex.raw(`
        ALTER TABLE ${tableName}
        ADD CONSTRAINT check_course_dates CHECK (start_date < end_date);
    `);

    await knex.raw(`
        CREATE TRIGGER update_timestamp
        BEFORE UPDATE ON ${tableName}
        FOR EACH ROW
        EXECUTE PROCEDURE update_timestamp();
    `);
};

exports.down = (knex) => knex.schema.dropTable(tableName);
