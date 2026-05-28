const tableName = 'jobs';

exports.up = async knex => {
    await knex.schema.createTable(tableName, table => {
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table
            .uuid('company_id')
            .notNullable()
            .references('id')
            .inTable('companies')
            .onDelete('CASCADE');
        table.string('title').notNullable();
        table.string('job_type');
        table.string('work_mode');
        table.string('experience_required');
        table.jsonb('skills');
        table.integer('salary_min');
        table.integer('salary_max');
        table.string('location');
        table.decimal('latitude', 10, 8);
        table.decimal('longitude', 11, 8);
        table.specificType('working_time', 'working_time_type');
        table.text('description');
        table.specificType('status', 'job_status');
        table.timestamps(false, true);
        table.dateTime('deleted_at').defaultTo(null);

        table.index('company_id');
        table.index('status');
        table.index(['status', 'created_at']);
    });

    await knex.raw(`
        ALTER TABLE ${tableName}
        ADD CONSTRAINT check_salary_min CHECK (salary_min >= 0);
    `);
    await knex.raw(`
        ALTER TABLE ${tableName}
        ADD CONSTRAINT check_salary_max CHECK (salary_max >= salary_min);
    `);

    await knex.raw(`
        CREATE TRIGGER update_timestamp
        BEFORE UPDATE ON ${tableName}
        FOR EACH ROW
        EXECUTE PROCEDURE update_timestamp();
    `);
};

exports.down = knex => knex.schema.dropTable(tableName);
