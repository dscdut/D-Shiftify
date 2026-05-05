exports.up = async knex => {
    await knex.raw(`
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

        CREATE OR REPLACE FUNCTION update_timestamp()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = CURRENT_TIMESTAMP;
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;

        CREATE TYPE application_status AS ENUM ('applied', 'accepted', 'rejected');
        CREATE TYPE match_status AS ENUM ('pending', 'matched', 'rejected');
        CREATE TYPE skill_type AS ENUM ('soft', 'hard');
        CREATE TYPE duration_type AS ENUM ('short_term', 'medium_term', 'long_term');
        CREATE TYPE enrollment_status AS ENUM ('studying', 'completed', 'dropped');
        CREATE TYPE working_time_type AS ENUM ('part_time', 'full_time');
        CREATE TYPE job_status AS ENUM ('open', 'closed', 'paused');
    `);
};

exports.down = async knex => {
    await knex.raw(`
        DROP TYPE IF EXISTS application_status CASCADE;
        DROP TYPE IF EXISTS match_status CASCADE;
        DROP TYPE IF EXISTS skill_type CASCADE;
        DROP TYPE IF EXISTS duration_type CASCADE;
        DROP TYPE IF EXISTS enrollment_status CASCADE;
        DROP TYPE IF EXISTS working_time_type CASCADE;
        DROP TYPE IF EXISTS job_status CASCADE;
        DROP FUNCTION IF EXISTS update_timestamp() CASCADE;
    `);
};
