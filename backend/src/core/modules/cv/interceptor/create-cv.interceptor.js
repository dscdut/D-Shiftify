import Joi from 'joi';
import { DefaultValidatorInterceptor } from 'core/infrastructure/interceptor';
import { JoiUtils } from '../../../utils';

export const CreateCVInterceptor = new DefaultValidatorInterceptor(
    Joi.object({
        profileId: JoiUtils.requiredString(),
        jobType: JoiUtils.optionalString(),
        workMode: JoiUtils.optionalString(),
        mobility: JoiUtils.optionalString(),
        expectedJob: JoiUtils.optionalString(),
        skills: Joi.array()
            .items(
                Joi.object({
                    name: Joi.string().required(),
                    type: Joi.string().valid('hard_skill', 'soft_skill').required(),
                })
            )
            .optional(),
        conditions: Joi.array().items(Joi.string()).optional(),
        experiences:Joi.array().items(Joi.object()).optional(),
        certificates: Joi.array().items(Joi.string()).optional(),
        customSections: Joi.array().items(Joi.object()).optional(),
        deviceIds: Joi.array().items(Joi.string().uuid()).optional(),
    }).unknown(true)
);