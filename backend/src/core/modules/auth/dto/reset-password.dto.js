import { ApiDocument } from 'core/config/swagger.config';
import { SwaggerDocument } from 'packages/swagger';

ApiDocument.addModel('ResetPasswordDto',
    {
        email: SwaggerDocument.ApiProperty({ type: 'string', example: 'user@example.com' }),
        otp: SwaggerDocument.ApiProperty({ type: 'string', example: '123456' }),
        new_password: SwaggerDocument.ApiProperty({ type: 'string' }),
    });

export const ResetPasswordDto = body => ({
    email: body.email,
    otp: body.otp,
    new_password: body.new_password,
});
