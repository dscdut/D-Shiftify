import { DefaultValidatorInterceptor } from 'core/infrastructure/interceptor';
import { JoiUtils } from 'core/utils';
import Joi from 'joi';

export const LogoutInterceptor = new DefaultValidatorInterceptor(
    Joi.object({
        refresh_token: JoiUtils.requiredString(),
    })
);
