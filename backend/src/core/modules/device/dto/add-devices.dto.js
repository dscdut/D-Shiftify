import { ApiDocument } from 'core/config/swagger.config';
import { SwaggerDocument } from 'packages/swagger';

ApiDocument.addModel('AddDevicesDto', {
    device_ids: SwaggerDocument.ApiProperty({ type: 'array', items: { type: 'string' } }),
});

export const AddDevicesDto = body => ({
    device_ids: body.device_ids,
});
