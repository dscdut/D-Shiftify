import Joi from 'joi';
import { DefaultValidatorInterceptor } from 'core/infrastructure/interceptor';
import { JoiUtils } from '../../../utils';

export const JoinConversationSchema = Joi.object({
    conversationId: JoiUtils.requiredString(),
}).unknown(true);

export const JoinConversationInterceptor = new DefaultValidatorInterceptor(
    JoinConversationSchema
);