import { ApiDocument } from 'core/config/swagger.config';
import { SwaggerDocument } from 'packages/swagger';

ApiDocument.addModel('CreateApplicationDto', {
        jobId: SwaggerDocument.ApiProperty({ type: 'string' }),
        cvId: SwaggerDocument.ApiProperty({ type: 'string' }),
    });

export const CreateApplicationDto = body => ({
        job_id: body.jobId,
        cv_id: body.cvId,
    });
