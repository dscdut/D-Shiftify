exports.seed = async knex => {
    await knex('courses').del();

    const centers = await knex('training_centers').select('id');

    const courses = [];

    centers.forEach((center, centerIndex) => {
        const numCourses = 3 + (centerIndex % 2);
        for (let i = 0; i < numCourses; i++) {
            const index = centerIndex * 4 + i;
            courses.push({
                id: knex.raw('uuid_generate_v4()'),
                center_id: center.id,
                title:
                    index % 8 === 0
                        ? 'Basic Computer Skills'
                        : index % 8 === 1
                        ? 'Web Development Fundamentals'
                        : index % 8 === 2
                        ? 'Customer Service Excellence'
                        : index % 8 === 3
                        ? 'Data Entry and Office Administration'
                        : index % 8 === 4
                        ? 'Digital Marketing Basics'
                        : index % 8 === 5
                        ? 'Graphic Design Introduction'
                        : index % 8 === 6
                        ? 'Mobile App Development'
                        : 'Business Communication',
                duration_type:
                    index % 3 === 0
                        ? 'short_term'
                        : index % 3 === 1
                        ? 'medium_term'
                        : 'long_term',
                start_date: new Date(2026, index % 12, 1),
                end_date: new Date(2026, ((index % 12) + 3) % 12, 28),
                mode:
                    index % 3 === 0
                        ? 'online'
                        : index % 3 === 1
                        ? 'offline'
                        : 'hybrid',
                certificate_output:
                    index % 2 === 0
                        ? 'Certificate of Completion'
                        : 'Professional Certificate',
                description:
                    'Comprehensive training program designed for individuals with disabilities to develop professional skills.',
                created_at: knex.fn.now(),
                updated_at: knex.fn.now(),
                deleted_at: null,
            });
        }
    });

    await knex('courses').insert(courses);
};
