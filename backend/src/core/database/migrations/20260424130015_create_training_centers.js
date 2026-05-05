// @ts-check
/**
 * Create training_centers table
 */
const tableName = 'training_centers';

exports.up = async (knex) => {
    await knex.schema.createTable(tableName, (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table.string('name');
        table.string('slogan');
        table.string('phone');
        table.string('email');
        table.string('website');
        table.decimal('latitude', 10, 8);
        table.decimal('longitude', 11, 8);
        table.string('organization_type');
        table.text('support_for_disabled');
        table.text('partner_companies');
        table.text('achievements');
        table.string('license_file');
        table.string('logo_url');
        table.timestamps(false, true);
        table.dateTime('deleted_at').defaultTo(null);
    });

    // Add geography column via raw SQL (PostGIS)
    await knex.raw(`
        ALTER TABLE ${tableName}
        ADD COLUMN location geography;
    `).catch(() => {
        // PostGIS extension may not be available, skip geography column
        console.log('PostGIS not available, skipping geography column for training_centers');
    });

    await knex.raw(`
        CREATE TRIGGER update_timestamp
        BEFORE UPDATE ON ${tableName}
        FOR EACH ROW
        EXECUTE PROCEDURE update_timestamp();
    `);
};

exports.down = (knex) => knex.schema.dropTable(tableName);
