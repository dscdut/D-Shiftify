import Joi from 'joi';
import { DefaultValidatorInterceptor } from 'core/infrastructure/interceptor';

const UUID_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const CreateConversationInterceptor = new DefaultValidatorInterceptor(
    Joi.object({
        participantIds: Joi.array()
            .items(
                Joi.string()
                    .trim()
                    .regex(UUID_REGEX),
            )
            .min(1)
            .required(),
    }),
);
