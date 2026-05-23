import { ApiDocument } from 'core/config/swagger.config';
import { SwaggerDocument } from 'packages/swagger';

ApiDocument.addModel('UpdateJobDto', {
    title: SwaggerDocument.ApiProperty({ type: 'string' }),
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
    description: SwaggerDocument.ApiProperty({ type: 'string' }),
    status: SwaggerDocument.ApiProperty({ type: 'string', enum: ['open', 'closed', 'paused'] }),
});

export const UpdateJobDto = body => {
    const dto = {};
    if (body.title !== undefined) dto.title = body.title;
    if (body.job_type !== undefined) dto.job_type = body.job_type;
    if (body.work_mode !== undefined) dto.work_mode = body.work_mode;
    if (body.experience_required !== undefined) dto.experience_required = body.experience_required;
    if (body.skills !== undefined) dto.skills = body.skills;
    if (body.salary_min !== undefined) dto.salary_min = body.salary_min;
    if (body.salary_max !== undefined) dto.salary_max = body.salary_max;
    if (body.location !== undefined) dto.location = body.location;
    if (body.latitude !== undefined) dto.latitude = body.latitude;
    if (body.longitude !== undefined) dto.longitude = body.longitude;
    if (body.working_time !== undefined) dto.working_time = body.working_time;
    if (body.description !== undefined) dto.description = body.description;
    if (body.status !== undefined) dto.status = body.status;
    return dto;
};