exports.seed = async knex => {
    await knex('job_devices').del();

    const jobs = await knex('jobs').select('id');
    const devices = await knex('assistive_devices').select('id');

    const jobDevices = [];

    jobs.forEach((job, index) => {
        const numDevices = (index % 3) + 1;
        for (let i = 0; i < numDevices && i < devices.length; i++) {
            jobDevices.push({
                job_id: job.id,
                device_id: devices[(index + i) % devices.length].id,
                created_at: knex.fn.now(),
                updated_at: knex.fn.now(),
            });
        }
    });

    if (jobDevices.length > 0) {
        await knex('job_devices').insert(jobDevices);
    }
};
