import { ApiDocument } from 'core/config/swagger.config';
import { SwaggerDocument } from 'packages/swagger';

ApiDocument.addModel('UpdateApplicationStatusDto', {
    status: SwaggerDocument.ApiProperty({
        type: 'string',
        enum: ['applied', 'accepted', 'rejected'],
    }),
});

export const UpdateApplicationStatusDto = body => ({
    status: body.status,
});