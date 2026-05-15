import { DefaultValidatorInterceptor } from 'core/infrastructure/interceptor';
import Joi from 'joi';

export const UpdateProfileInterceptor = new DefaultValidatorInterceptor(
    Joi.object({
        full_name: Joi.string().max(255),
        dob: Joi.string().isoDate(),
        gender: Joi.string().valid('male', 'female', 'other'),
        phone: Joi.string().pattern(/^[0-9]{10,11}$/).messages({
            'string.pattern.base': 'Phone must be 10-11 digits',
        }),
        disability_status: Joi.string().max(500),
        device_ids: Joi.array().items(Joi.string().uuid()).min(0),
    }).min(1).messages({
        'object.min': 'At least one field must be provided',
    })
);
