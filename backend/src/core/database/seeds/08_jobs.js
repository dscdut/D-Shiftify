exports.seed = async knex => {
    await knex('jobs').del();

    const companies = await knex('companies').select('id');

    const jobs = [];
    companies.forEach((company, companyIndex) => {
        const numJobs = (companyIndex % 2) + 2;
        for (let i = 0; i < numJobs; i++) {
            const index = companyIndex * 3 + i;
            jobs.push({
                id: knex.raw('uuid_generate_v4()'),
                company_id: company.id,
                title:
                    index % 6 === 0
                        ? 'Software Developer'
                        : index % 6 === 1
                        ? 'Customer Service Representative'
                        : index % 6 === 2
                        ? 'Data Entry Specialist'
                        : index % 6 === 3
                        ? 'Graphic Designer'
                        : index % 6 === 4
                        ? 'Content Writer'
                        : 'Administrative Assistant',
                job_type:
                    index % 3 === 0
                        ? 'full_time'
                        : index % 3 === 1
                        ? 'part_time'
                        : 'contract',
                work_mode:
                    index % 3 === 0
                        ? 'remote'
                        : index % 3 === 1
                        ? 'onsite'
                        : 'hybrid',
                experience_required:
                    index % 3 === 0
                        ? 'entry_level'
                        : index % 3 === 1
                        ? '1-3 years'
                        : '3+ years',
                skills: JSON.stringify([
                    { name: 'Communication', required: true },
                    { name: 'Teamwork', required: false },
                ]),
                salary_min: 8000000 + index * 1000000,
                salary_max: 15000000 + index * 2000000,
                location: `District ${(index % 12) + 1}, Ho Chi Minh City`,
                latitude: 10.7769 + index * 0.005,
                longitude: 106.7009 + index * 0.005,
                working_time: index % 2 === 0 ? 'full_time' : 'part_time',
                description: `We are looking for a talented individual to join our team. This position offers great opportunities for growth and development.`,
                status:
                    index % 4 === 3
                        ? 'closed'
                        : index % 4 === 2
                        ? 'paused'
                        : 'open',
                created_at: knex.fn.now(),
                updated_at: knex.fn.now(),
                deleted_at: null,
            });
        }
    });

    await knex('jobs').insert(jobs);
};
