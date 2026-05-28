exports.seed = async knex => {
    await knex('conversations').del();

    const candidateRole = await knex('roles')
        .where('name', 'candidate')
        .first();
    const recruiterRole = await knex('roles')
        .where('name', 'recruiter')
        .first();

    const candidates = await knex('users')
        .where('role_id', candidateRole.id)
        .select('id');
    const recruiters = await knex('users')
        .where('role_id', recruiterRole.id)
        .select('id');

    const conversations = [];
    const participants = [];
    const messages = [];

    for (let index = 0; index < candidates.length; index++) {
        const candidate = candidates[index];
        const recruiter = recruiters[index % recruiters.length];

        // Generate UUID once and reuse it
        const conversationIdResult = await knex.raw('SELECT uuid_generate_v4() as id');
        const conversationId = conversationIdResult.rows[0].id;

        conversations.push({
            id: conversationId,
            created_at: knex.fn.now(),
            updated_at: knex.fn.now(),
        });

        participants.push({
            conversation_id: conversationId,
            user_id: candidate.id,
            created_at: knex.fn.now(),
            updated_at: knex.fn.now(),
        });

        participants.push({
            conversation_id: conversationId,
            user_id: recruiter.id,
            created_at: knex.fn.now(),
            updated_at: knex.fn.now(),
        });

        messages.push({
            id: knex.raw('uuid_generate_v4()'),
            conversation_id: conversationId,
            sender_id: recruiter.id,
            content:
                'Hello! We reviewed your application and would like to discuss the position further.',
            voice_url: null,
            type: 'text',
            created_at: knex.fn.now(),
            updated_at: knex.fn.now(),
            deleted_at: null,
        });

        messages.push({
            id: knex.raw('uuid_generate_v4()'),
            conversation_id: conversationId,
            sender_id: candidate.id,
            content:
                'Thank you for reaching out! I am very interested in this opportunity.',
            voice_url: null,
            type: 'text',
            created_at: knex.fn.now(),
            updated_at: knex.fn.now(),
            deleted_at: null,
        });
    }

    if (conversations.length > 0) {
        await knex('conversations').insert(conversations);
        await knex('participants').insert(participants);
        await knex('messages').insert(messages);
    }
};
