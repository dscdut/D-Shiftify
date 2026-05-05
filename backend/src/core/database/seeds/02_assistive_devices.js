const ASSISTIVE_DEVICES = [
    { name: 'Wheelchair' },
    { name: 'Screen Reader' },
    { name: 'Hearing Aid' },
    { name: 'Prosthetic Limb' },
    { name: 'Crutches' },
    { name: 'Braille Display' },
    { name: 'Voice Recognition Software' },
    { name: 'Magnification Software' },
];

exports.seed = async knex => {
    await knex('assistive_devices').del();

    const devices = ASSISTIVE_DEVICES.map(device => ({
        id: knex.raw('uuid_generate_v4()'),
        name: device.name,
        created_at: knex.fn.now(),
        updated_at: knex.fn.now(),
    }));

    await knex('assistive_devices').insert(devices);
};
