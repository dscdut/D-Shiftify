// @ts-check
/**
 * Drop old tables to prepare for new schema
 */
exports.up = async (knex) => {
    await knex.schema.dropTableIfExists('users_roles');
    await knex.schema.dropTableIfExists('roles');
    await knex.schema.dropTableIfExists('users');
};

exports.down = async (knex) => {
    // Old tables cannot be restored - they were replaced by new schema
};
