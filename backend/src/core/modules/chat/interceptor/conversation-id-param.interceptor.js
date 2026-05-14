import Joi from 'joi';
import { ParamsValidatorInterceptor } from './params-validator.interceptor';

const UUID_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const ConversationIdParamInterceptor = new ParamsValidatorInterceptor(
    Joi.object({
        conversationId: Joi.string()
            .trim()
            .regex(UUID_REGEX)
            .required(),
    }),
);
