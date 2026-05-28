import { ApiDocument } from 'core/config/swagger.config';
import { SwaggerDocument } from 'packages/swagger';
import { APPLICATION_STATUS } from '../services/application.enum';

ApiDocument.addModel('UpdateApplicationStatusDto', {
    status: SwaggerDocument.ApiProperty({
        type: 'string',
        enum: Object.values(APPLICATION_STATUS),
    }),
});

export const UpdateApplicationStatusDto = body => ({
    status: body.status,
});