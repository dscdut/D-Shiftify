import { ApiDocument } from 'core/config/swagger.config';
import { SwaggerDocument } from 'packages/swagger';

ApiDocument.addModel('PostJobDto', {
    title: SwaggerDocument.ApiProperty({ type: 'string' }),
    description: SwaggerDocument.ApiProperty({ type: 'string' }),
    job_type: SwaggerDocument.ApiProperty({ type: 'string', enum: ['full_time', 'part_time', 'contract'] }),
    work_mode: SwaggerDocument.ApiProperty({ type: 'string', enum: ['remote', 'onsite', 'hybrid'] }),
    experience_required: SwaggerDocument.ApiProperty({ type: 'string' }),
    skills: SwaggerDocument.ApiProperty({
        type: 'array',
        items: SwaggerDocument.ApiProperty({
            type: 'object',
            properties: {
                name: SwaggerDocument.ApiProperty({ type: 'string' }),
                required: SwaggerDocument.ApiProperty({ type: 'boolean' }),
            },
        }),
    }),
    salary_min: SwaggerDocument.ApiProperty({ type: 'number' }),
    salary_max: SwaggerDocument.ApiProperty({ type: 'number' }),
    location: SwaggerDocument.ApiProperty({ type: 'string' }),
    latitude: SwaggerDocument.ApiProperty({ type: 'number' }),
    longitude: SwaggerDocument.ApiProperty({ type: 'number' }),
    working_time: SwaggerDocument.ApiProperty({ type: 'string', enum: ['full_time', 'part_time'] }),
    status: SwaggerDocument.ApiProperty({ type: 'string', enum: ['open', 'closed', 'paused'] }),
    assistive_devices: SwaggerDocument.ApiProperty({ type: 'array', items: { type: 'string' } }),
});

export const PostJobDto = body => ({
    title: body.title,
    description: body.description,
    job_type: body.job_type,
    work_mode: body.work_mode,
    experience_required: body.experience_required,
    skills: body.skills,
    salary_min: body.salary_min,
    salary_max: body.salary_max,
    location: body.location,
    latitude: body.latitude,
    longitude: body.longitude,
    working_time: body.working_time,
    status: body.status,
    assistive_devices: body.assistive_devices,
});