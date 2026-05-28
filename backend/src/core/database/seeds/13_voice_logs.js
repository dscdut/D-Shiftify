exports.seed = async knex => {
    await knex('voice_logs').del();

    const users = await knex('users').select('id');

    const voiceLogs = users.map((user, index) => ({
        id: knex.raw('uuid_generate_v4()'),
        user_id: user.id,
        type:
            index % 3 === 0
                ? 'text_to_speech'
                : index % 3 === 1
                ? 'speech_to_text'
                : 'voice_command',
        source: index % 2 === 0 ? 'mobile_app' : 'web_app',
        reference_id: knex.raw('uuid_generate_v4()'),
        status:
            index % 4 === 0
                ? 'pending'
                : index % 4 === 1
                ? 'processing'
                : index % 4 === 2
                ? 'completed'
                : 'failed',
        created_at: knex.fn.now(),
        updated_at: knex.fn.now(),
    }));

    await knex('voice_logs').insert(voiceLogs);
};
