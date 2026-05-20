exports.up = function(knex) {
  return knex.schema.raw('CREATE EXTENSION IF NOT EXISTS vector;')
    .alterTable('jobs', table => {
      table.specificType('embedding', 'vector(768)');
      table.jsonb('weights_json');
    })
    .alterTable('profiles', table => {
      table.specificType('narrative_embedding', 'vector(768)');
    });
};

exports.down = function(knex) {
  return knex.schema
    .alterTable('profiles', table => {
      table.dropColumn('narrative_embedding');
    })
    .alterTable('jobs', table => {
      table.dropColumn('embedding');
      table.dropColumn('weights_json');
    })
    .raw('DROP EXTENSION IF EXISTS vector;');
};
