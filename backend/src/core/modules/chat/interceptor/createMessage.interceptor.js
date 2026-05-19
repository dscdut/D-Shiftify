import Joi from 'joi';
import { DefaultValidatorInterceptor } from 'core/infrastructure/interceptor';
import { JoiUtils } from '../../../utils';

export const CreateMessageSchema =
    Joi.object({
        conversationId: JoiUtils.requiredString(),
        content: JoiUtils.requiredString(),
        voiceUrl: JoiUtils.optionalString(),
    }).unknown(true);


export const CreateMessageInterceptor =
    new DefaultValidatorInterceptor(
        CreateMessageSchema
    );