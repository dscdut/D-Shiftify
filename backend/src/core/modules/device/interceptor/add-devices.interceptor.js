import { DefaultValidatorInterceptor } from 'core/infrastructure/interceptor';
import Joi from 'joi';

export const AddDevicesInterceptor = new DefaultValidatorInterceptor(
    Joi.object({
        device_ids: Joi.array().items(Joi.string().uuid()).min(1).required().messages({
            'array.min': 'At least one device_id must be provided',
        }),
    })
);
