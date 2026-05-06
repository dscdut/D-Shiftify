exports.seed = async knex => {
    await knex('companies').del();

    const recruiterRole = await knex('roles')
        .where('name', 'recruiter')
        .first();
    const recruiters = await knex('users')
        .where('role_id', recruiterRole.id)
        .select('id');

    const companies = recruiters.map((user, index) => ({
        id: knex.raw('uuid_generate_v4()'),
        user_id: user.id,
        name: `Company ${index + 1}`,
        slogan: `Making a difference for everyone`,
        phone: `028${7000000 + index}`,
        email: `contact@company${index + 1}.com`,
        website: `https://company${index + 1}.com`,
        industry:
            index % 3 === 0
                ? 'Technology'
                : index % 3 === 1
                ? 'Manufacturing'
                : 'Services',
        tax_code: `${1000000000 + index}`,
        address: `${index + 1} Business Street, District ${
            index + 1
        }, Ho Chi Minh City`,
        latitude: 10.7769 + index * 0.01,
        longitude: 106.7009 + index * 0.01,
        policy_for_disabled:
            'We provide accessible workspaces and flexible working arrangements for employees with disabilities.',
        experience_with_disabled:
            'We have successfully employed people with disabilities for over 5 years.',
        license_file: `license_company_${index + 1}.pdf`,
        logo_url: `https://company${index + 1}.com/logo.png`,
        created_at: knex.fn.now(),
        updated_at: knex.fn.now(),
        deleted_at: null,
    }));

    await knex('companies').insert(companies);
};
