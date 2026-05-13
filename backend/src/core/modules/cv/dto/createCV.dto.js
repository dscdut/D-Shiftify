import { ApiDocument } from 'core/config/swagger.config';
import { SwaggerDocument } from 'packages/swagger';

ApiDocument.addModel('CreateCVDto', {
    profileId: SwaggerDocument.ApiProperty({ type: 'string' }),
    jobType: SwaggerDocument.ApiProperty({ type: 'string', required: false }),
    workMode: SwaggerDocument.ApiProperty({ type: 'string', required: false }),
    mobility: SwaggerDocument.ApiProperty({ type: 'string', required: false }),
    expectedJob: SwaggerDocument.ApiProperty({ type: 'string', required: false }),
    deviceIds: SwaggerDocument.ApiProperty({type: 'array', required: false,items: {type: 'string',},}),
    skills: SwaggerDocument.ApiProperty({type: 'array', required: false,
        items: {
            type: 'object', required: ['name', 'type'],
            properties: {
                name: {
                    type: 'string',
                },
                type: {
                    type: 'string',
                    enum: ['hard_skill', 'soft_skill'],
                },
            },
        },
    }),
    conditions: SwaggerDocument.ApiProperty({type: 'array', required: false,items: {type: 'string',},}),
    experiences: SwaggerDocument.ApiProperty({type: 'array', required: false,
        items: {
            type: 'object',
            properties: {
                description: {
                    type: 'string',
                },
                company: {
                    type: 'string',
                },
                position: {
                    type: 'string',
                },
                startDate: {
                    type: 'string',
                },
                endDate: {
                    type: 'string',
                },
            },
        },
    }),
    certificates: SwaggerDocument.ApiProperty({type: 'array', required: false,items: {type: 'string',},}),
    customSections: SwaggerDocument.ApiProperty({type: 'array', required: false,
        items: {
            type: 'object',
            properties: {
                title: {
                    type: 'string',
                },
                content: {
                    type: 'string',
                },
            },
        },
    }),
});

export const CreateCVDto = body => ({
    profile_id: body.profileId,
    job_type: body.jobType || null,
    work_mode: body.workMode || null,
    mobility: body.mobility || null,
    expected_job: body.expectedJob || null,
    skills: body.skills ? JSON.stringify(body.skills) : null,
    conditions: body.conditions ? JSON.stringify(body.conditions) : null,
    experiences: body.experiences ? JSON.stringify(body.experiences) : null,
    certificates: body.certificates ? JSON.stringify(body.certificates) : null,
    custom_sections: body.customSections ? JSON.stringify(body.customSections) : null,
});