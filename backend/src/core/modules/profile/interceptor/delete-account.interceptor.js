import { DefaultValidatorInterceptor } from 'core/infrastructure/interceptor';
import { JoiUtils } from 'core/utils';
import Joi from 'joi';

export const DeleteAccountInterceptor = new DefaultValidatorInterceptor(
    Joi.object({
        password: JoiUtils.requiredString(),
    })
);
