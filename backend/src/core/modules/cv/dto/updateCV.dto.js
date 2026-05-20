import { ApiDocument } from 'core/config/swagger.config';
import { SwaggerDocument } from 'packages/swagger';

ApiDocument.addModel('UpdateCVDto', {
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
export const UpdateCVDto = body => {
    const dto = {};

    if (body.jobType !== undefined) dto.job_type = body.jobType;
    if (body.workMode !== undefined) dto.work_mode = body.workMode;
    if (body.mobility !== undefined) dto.mobility = body.mobility;
    if (body.expectedJob !== undefined) dto.expected_job = body.expectedJob;
    if (body.skills !== undefined) dto.skills = JSON.stringify(body.skills);
    if (body.conditions !== undefined) dto.conditions = JSON.stringify(body.conditions);
    if (body.experiences !== undefined) dto.experiences = JSON.stringify(body.experiences);
    if (body.certificates !== undefined) dto.certificates = JSON.stringify(body.certificates);
    if (body.customSections !== undefined) dto.custom_sections = JSON.stringify(body.customSections);

    return dto;
};