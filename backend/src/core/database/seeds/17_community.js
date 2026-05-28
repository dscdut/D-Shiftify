exports.seed = async knex => {
    await knex('comments').del();
    await knex('community_posts').del();

    const users = await knex('users').select('id');

    const communityPosts = [];
    const comments = [];

    for (let index = 0; index < users.length; index++) {
        const user = users[index];

        // Generate UUID once and reuse it
        const postIdResult = await knex.raw('SELECT uuid_generate_v4() as id');
        const postId = postIdResult.rows[0].id;

        communityPosts.push({
            id: postId,
            user_id: user.id,
            content:
                index % 4 === 0
                    ? 'Looking for advice on accessible workplace accommodations. What has worked well for you?'
                    : index % 4 === 1
                    ? 'Just completed my training program! Excited to start my job search.'
                    : index % 4 === 2
                    ? 'Does anyone have experience with remote work opportunities?'
                    : 'Sharing my success story - landed my first job after 6 months of searching!',
            voice_url:
                index % 3 === 0
                    ? `https://storage.example.com/voice/${index}.mp3`
                    : null,
            topic:
                index % 5 === 0
                    ? 'job_search'
                    : index % 5 === 1
                    ? 'workplace_tips'
                    : index % 5 === 2
                    ? 'success_stories'
                    : index % 5 === 3
                    ? 'training'
                    : 'general',
            type: index % 3 === 0 ? 'voice' : 'text',
            created_at: knex.fn.now(),
            updated_at: knex.fn.now(),
            deleted_at: null,
        });

        const numComments = (index % 2) + 1;
        for (let i = 0; i < numComments; i++) {
            const commenterIndex = (index + i + 1) % users.length;
            comments.push({
                id: knex.raw('uuid_generate_v4()'),
                parent_id: null,
                post_id: postId,
                user_id: users[commenterIndex].id,
                type: 'text',
                content:
                    i === 0
                        ? 'Great question! I have some experience with this.'
                        : 'Thanks for sharing!',
                created_at: knex.fn.now(),
                updated_at: knex.fn.now(),
                deleted_at: null,
            });
        }
    }

    if (communityPosts.length > 0) {
        await knex('community_posts').insert(communityPosts);
        await knex('comments').insert(comments);
    }
};
