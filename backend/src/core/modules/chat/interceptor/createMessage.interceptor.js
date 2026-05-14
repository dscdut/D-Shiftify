import Joi from 'joi';
import { DefaultValidatorInterceptor } from 'core/infrastructure/interceptor';

export const CreateMessageInterceptor = new DefaultValidatorInterceptor(
    Joi.object({
        content: Joi.string().trim().allow('', null).optional(),
        voiceUrl: Joi.string().uri().allow(null).optional(),
        type: Joi.string().valid('text', 'voice').default('text'),
    }).or('content', 'voiceUrl'),
);
