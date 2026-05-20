 import Joi from 'joi';
import { DefaultValidatorInterceptor } from 'core/infrastructure/interceptor';
import { JoiUtils } from '../../../utils';

export const UpdateCVInterceptor = new DefaultValidatorInterceptor(
    Joi.object({
        profileId: JoiUtils.optionalString(),
        jobType: JoiUtils.optionalString(),
        workMode: JoiUtils.optionalString(),
        summary: JoiUtils.optionalString(),
        skills: Joi.array()
            .items(
                Joi.object({
                    name: Joi.string().required(),
                    type: Joi.string().valid('hard_skill', 'soft_skill').required(),
                })
            )
            .optional(),
        experiences: Joi.array().items(Joi.object()).optional(),
        educations: Joi.array().items(Joi.object()).optional(),
        certifications: Joi.array().items(Joi.object()).optional(),
        languages: Joi.array().items(Joi.string()).optional(),
        avatar: JoiUtils.optionalString(),
        status: JoiUtils.optionalString(),
    }).unknown(true)
);