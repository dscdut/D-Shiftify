exports.seed = async knex => {
    await knex('user_devices').del();

    const profiles = await knex('profiles').select('id');
    const devices = await knex('assistive_devices').select('id', 'name');

    const userDevices = [];

    profiles.forEach((profile, index) => {
        const numDevices = (index % 3) + 1;
        for (let i = 0; i < numDevices && i < devices.length; i++) {
            userDevices.push({
                id: knex.raw('uuid_generate_v4()'),
                profile_id: profile.id,
                device_id: devices[(index + i) % devices.length].id,
                created_at: knex.fn.now(),
                updated_at: knex.fn.now(),
            });
        }
    });

    if (userDevices.length > 0) {
        await knex('user_devices').insert(userDevices);
    }
};
