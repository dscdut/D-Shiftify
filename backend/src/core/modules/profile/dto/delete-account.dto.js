import { ApiDocument } from 'core/config/swagger.config';
import { SwaggerDocument } from 'packages/swagger';

ApiDocument.addModel('DeleteAccountDto', {
    password: SwaggerDocument.ApiProperty({ type: 'string', format: 'password' }),
});

export const DeleteAccountDto = body => ({
    password: body.password,
});
