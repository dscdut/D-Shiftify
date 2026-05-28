exports.seed = async knex => {
    await knex('training_centers').del();

    const trainingCenters = [
        {
            name: 'Hanoi Vocational Training Center for People with Disabilities',
            slogan: 'Empowering through education',
            phone: '0243123456',
            email: 'contact@hvtc.edu.vn',
            website: 'https://hvtc.edu.vn',
            latitude: 21.0285,
            longitude: 105.8542,
            organization_type: 'public',
            support_for_disabled:
                'We provide comprehensive support including accessible facilities, assistive technology, and specialized instructors.',
            partner_companies: 'FPT Software, Viettel, VNPT',
            achievements:
                'Over 1000 graduates successfully employed in the past 5 years',
            license_file: 'license_hvtc.pdf',
            logo_url: 'https://hvtc.edu.vn/logo.png',
        },
        {
            name: 'Ho Chi Minh City Training Center for the Disabled',
            slogan: 'Building skills, building futures',
            phone: '0287654321',
            email: 'info@hcmtcd.edu.vn',
            website: 'https://hcmtcd.edu.vn',
            latitude: 10.7769,
            longitude: 106.7009,
            organization_type: 'non_profit',
            support_for_disabled:
                'Specialized training programs with focus on IT, customer service, and administrative skills.',
            partner_companies: 'Grab, Shopee, Lazada',
            achievements:
                'Recognized as top training center for disabled individuals in Southern Vietnam',
            license_file: 'license_hcmtcd.pdf',
            logo_url: 'https://hcmtcd.edu.vn/logo.png',
        },
    ];

    const centers = trainingCenters.map(center => ({
        id: knex.raw('uuid_generate_v4()'),
        ...center,
        created_at: knex.fn.now(),
        updated_at: knex.fn.now(),
        deleted_at: null,
    }));

    await knex('training_centers').insert(centers);
};
