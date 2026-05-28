exports.up = async knex => {
    // Community posts
    await knex.schema.createTable('community_posts', table => {
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table
            .uuid('user_id')
            .references('id')
            .inTable('users')
            .onDelete('SET NULL');
        table.text('content').notNullable();
        table.text('voice_url');
        table.string('topic');
        table.string('type');
        table.timestamps(false, true);
        table.dateTime('deleted_at').defaultTo(null);

        table.index('user_id');
        table.index('topic');
        table.index(['topic', 'created_at']);
    });

    await knex.raw(`
        CREATE TRIGGER update_timestamp
        BEFORE UPDATE ON community_posts
        FOR EACH ROW
        EXECUTE PROCEDURE update_timestamp();
    `);

    // Comments
    await knex.schema.createTable('comments', table => {
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table
            .uuid('parent_id')
            .references('id')
            .inTable('comments')
            .onDelete('CASCADE');
        table
            .uuid('post_id')
            .references('id')
            .inTable('community_posts')
            .onDelete('CASCADE');
        table
            .uuid('user_id')
            .references('id')
            .inTable('users')
            .onDelete('SET NULL');
        table.string('type');
        table.text('content').notNullable();
        table.timestamps(false, true);
        table.dateTime('deleted_at').defaultTo(null);

        table.index('post_id');
        table.index('user_id');
        table.index(['post_id', 'created_at']);
    });

    await knex.raw(`
        CREATE TRIGGER update_timestamp
        BEFORE UPDATE ON comments
        FOR EACH ROW
        EXECUTE PROCEDURE update_timestamp();
    `);
};

exports.down = async knex => {
    await knex.schema.dropTableIfExists('comments');
    await knex.schema.dropTableIfExists('community_posts');
};
