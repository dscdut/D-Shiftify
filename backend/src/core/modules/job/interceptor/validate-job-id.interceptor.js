import Joi from 'joi';
import { ParamsValidatorInterceptor } from 'core/infrastructure/interceptor/params-validator.interceptor';

export const ValidateJobIdInterceptor = new ParamsValidatorInterceptor(
    Joi.object({
        id: Joi.string().uuid().required().messages({
            'string.guid': 'Job ID is not in the correct UUID format!',
        }),
    }),
);
