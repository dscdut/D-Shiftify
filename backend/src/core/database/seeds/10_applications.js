exports.seed = async knex => {
    await knex('applications').del();

    const jobs = await knex('jobs').where('status', 'open').select('id');
    const cvs = await knex('cvs').select('id');

    const applications = [];

    cvs.forEach((cv, cvIndex) => {
        const numApplications = (cvIndex % 2) + 1;
        for (let i = 0; i < numApplications && i < jobs.length; i++) {
            const jobIndex = (cvIndex + i) % jobs.length;
            applications.push({
                id: knex.raw('uuid_generate_v4()'),
                job_id: jobs[jobIndex].id,
                cv_id: cv.id,
                status:
                    cvIndex % 3 === 0
                        ? 'applied'
                        : cvIndex % 3 === 1
                        ? 'accepted'
                        : 'rejected',
                created_at: knex.fn.now(),
                updated_at: knex.fn.now(),
                deleted_at: null,
            });
        }
    });

    if (applications.length > 0) {
        await knex('applications').insert(applications);
    }
};
