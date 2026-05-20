import { ApiDocument } from 'core/config/swagger.config';
import { SwaggerDocument } from 'packages/swagger';
import { APPLICATION_STATUS } from '../services/application.enum';

ApiDocument.addModel('ApplicationDto', {
    id: SwaggerDocument.ApiProperty({ type: 'string' }),
    jobId: SwaggerDocument.ApiProperty({ type: 'string' }),
    cvId: SwaggerDocument.ApiProperty({ type: 'string' }),
    status: SwaggerDocument.ApiProperty({ type: 'enum', model: APPLICATION_STATUS }),
    jobTitle: SwaggerDocument.ApiProperty({ type: 'string', required: false }),
    createdAt: SwaggerDocument.ApiProperty({ type: 'dateTime' }),
});

export const ApplicationDto = body => ({
    id: body.id,
    jobId: body.jobId,
    cvId: body.cvId,
    status: body.status,
    jobTitle: body.jobTitle || null,
    createdAt: body.createdAt,
});