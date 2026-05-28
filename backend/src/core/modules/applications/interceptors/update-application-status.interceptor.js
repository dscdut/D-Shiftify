import Joi from 'joi';
import { DefaultValidatorInterceptor } from 'core/infrastructure/interceptor';
import { APPLICATION_STATUS } from '../services/application.enum';

export const UpdateApplicationStatusInterceptor = new DefaultValidatorInterceptor(
        Joi.object({
            status: Joi.string()
                .valid(...Object.values(APPLICATION_STATUS))
                .required(),
        }).unknown(true)
    );