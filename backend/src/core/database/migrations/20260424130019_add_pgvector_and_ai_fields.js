exports.up = async function(knex) {
    await knex.raw('CREATE EXTENSION IF NOT EXISTS vector;');

    await knex.schema.alterTable('jobs', table => {
        table.specificType('embedding', 'vector(768)');
        table.jsonb('weights_json');
    });

    await knex.schema.alterTable('profiles', table => {
        table.specificType('narrative_embedding', 'vector(768)');
    });
};

exports.down = async function(knex) {
    await knex.schema.alterTable('profiles', table => {
        table.dropColumn('narrative_embedding');
    });

    await knex.schema.alterTable('jobs', table => {
        table.dropColumn('embedding');
        table.dropColumn('weights_json');
    });

    await knex.raw('DROP EXTENSION IF EXISTS vector;');
};
