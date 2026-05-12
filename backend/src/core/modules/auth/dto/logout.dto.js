import { ApiDocument } from 'core/config/swagger.config';
import { SwaggerDocument } from 'packages/swagger';

ApiDocument.addModel('LogoutDto',
    {
        refresh_token: SwaggerDocument.ApiProperty({ type: 'string' }),
    });

export const LogoutDto = body => ({
    refresh_token: body.refresh_token,
});
