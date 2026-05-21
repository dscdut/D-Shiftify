import { DefaultValidatorInterceptor } from 'core/infrastructure/interceptor';
import Joi from 'joi';

export const UpdateJobInterceptor = new DefaultValidatorInterceptor(
    Joi.object({
        title: Joi.string().max(255),
        job_type: Joi.string().valid('full_time', 'part_time', 'contract'),
        work_mode: Joi.string().valid('remote', 'onsite', 'hybrid'),
        experience_required: Joi.string().max(255),
        skills: Joi.array().items(
            Joi.object({
                name: Joi.string().required().label('Skill Name'),
                required: Joi.boolean().required().label('Skill Required'),
            })
        ).min(0),
        salary_min: Joi.number(),
        salary_max: Joi.number(),
        location: Joi.string().max(255),
        latitude: Joi.number(),
        longitude: Joi.number(),
        working_time: Joi.string().max(255),
        description: Joi.string().max(255),
        status: Joi.string().valid('open', 'closed', 'paused'),
    })
);