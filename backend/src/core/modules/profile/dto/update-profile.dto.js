import { ApiDocument } from 'core/config/swagger.config';
import { SwaggerDocument } from 'packages/swagger';

ApiDocument.addModel('UpdateProfileDto', {
    full_name: SwaggerDocument.ApiProperty({ type: 'string' }),
    dob: SwaggerDocument.ApiProperty({ type: 'string', format: 'date' }),
    gender: SwaggerDocument.ApiProperty({ type: 'string' }),
    phone: SwaggerDocument.ApiProperty({ type: 'string' }),
    disability_status: SwaggerDocument.ApiProperty({ type: 'string' }),
    device_ids: SwaggerDocument.ApiProperty({ type: 'array', items: { type: 'string' } }),
});

export const UpdateProfileDto = body => ({
    full_name: body.full_name,
    dob: body.dob,
    gender: body.gender,
    phone: body.phone,
    disability_status: body.disability_status,
    device_ids: body.device_ids,
});
