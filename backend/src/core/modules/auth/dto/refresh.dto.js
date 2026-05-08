import { ApiDocument } from 'core/config/swagger.config';
import { SwaggerDocument } from 'packages/swagger';

ApiDocument.addModel('RefreshDto',
    {
        refresh_token: SwaggerDocument.ApiProperty({ type: 'string' }),
    });

export const RefreshDto = body => ({
    refresh_token: body.refresh_token,
});
