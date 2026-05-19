import Joi from 'joi';
import { DefaultValidatorInterceptor } from 'core/infrastructure/interceptor';

export const UpdateApplicationStatusInterceptor = new DefaultValidatorInterceptor(
        Joi.object({
            status: Joi.string()
                .valid(
                    'applied',
                    'accepted',
                    'rejected'
                )
                .required(),
        }).unknown(true)
    );