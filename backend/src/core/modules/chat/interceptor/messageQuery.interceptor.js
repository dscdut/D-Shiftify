import Joi from 'joi';
import { DefaultValidatorInterceptor } from 'core/infrastructure/interceptor';

export const MessageQueryInterceptor = new DefaultValidatorInterceptor(
    Joi.object({
        limit: Joi.number().integer().min(1).max(100).optional(),
        before: Joi.date().iso().optional(),
    }),
);
