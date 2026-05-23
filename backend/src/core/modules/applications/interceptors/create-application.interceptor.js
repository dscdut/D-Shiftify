import Joi from 'joi';
import { DefaultValidatorInterceptor } from 'core/infrastructure/interceptor';
import { JoiUtils } from '../../../utils';

export const CreateApplicationInterceptor = new DefaultValidatorInterceptor(
        Joi.object({
            jobId: JoiUtils.requiredString(),
            cvId: JoiUtils.requiredString(),
        }).unknown(true)
    );
