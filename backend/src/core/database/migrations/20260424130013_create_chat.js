exports.up = async knex => {
    // Conversations
    await knex.schema.createTable('conversations', table => {
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table.timestamps(false, true);
    });

    await knex.raw(`
        CREATE TRIGGER update_timestamp
        BEFORE UPDATE ON conversations
        FOR EACH ROW
        EXECUTE PROCEDURE update_timestamp();
    `);

    // Participants
    await knex.schema.createTable('participants', table => {
        table
            .uuid('conversation_id')
            .notNullable()
            .references('id')
            .inTable('conversations')
            .onDelete('CASCADE');
        table
            .uuid('user_id')
            .notNullable()
            .references('id')
            .inTable('users')
            .onDelete('CASCADE');
        table.timestamps(false, true);

        table.primary(['conversation_id', 'user_id']);
        table.index('conversation_id');
        table.index('user_id');
    });

    await knex.raw(`
        CREATE TRIGGER update_timestamp
        BEFORE UPDATE ON participants
        FOR EACH ROW
        EXECUTE PROCEDURE update_timestamp();
    `);

    // Messages
    await knex.schema.createTable('messages', table => {
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table
            .uuid('conversation_id')
            .notNullable()
            .references('id')
            .inTable('conversations')
            .onDelete('CASCADE');
        table
            .uuid('sender_id')
            .notNullable()
            .references('id')
            .inTable('users')
            .onDelete('CASCADE');
        table.text('content');
        table.text('voice_url');

        table.check('content IS NOT NULL OR voice_url IS NOT NULL');

        table.string('type').notNullable().defaultTo('text'); // 'text' or 'voice'

        table.timestamps(false, true);
        table.dateTime('deleted_at').defaultTo(null);

        table.index('conversation_id');
        table.index('sender_id');
        table.index(['conversation_id', 'created_at']);
    });

    await knex.raw(`
        CREATE TRIGGER update_timestamp
        BEFORE UPDATE ON messages
        FOR EACH ROW
        EXECUTE PROCEDURE update_timestamp();
    `);
};

exports.down = async knex => {
    await knex.schema.dropTableIfExists('messages');
    await knex.schema.dropTableIfExists('participants');
    await knex.schema.dropTableIfExists('conversations');
};
