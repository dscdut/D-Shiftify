import { ApiDocument } from 'core/config/swagger.config';
import { SwaggerDocument } from 'packages/swagger';

ApiDocument.addModel('RegisterDto',
    {
        email: SwaggerDocument.ApiProperty({ type: 'string' }),
        phone: SwaggerDocument.ApiProperty({ type: 'string' }),
        password: SwaggerDocument.ApiProperty({ type: 'string' }),
        role: SwaggerDocument.ApiProperty({ type: 'string' }),
        full_name: SwaggerDocument.ApiProperty({ type: 'string' }),
    });

export const RegisterDto = body => ({
    email: body.email,
    phone: body.phone,
    password: body.password,
    role: body.role,
    full_name: body.full_name,
});
