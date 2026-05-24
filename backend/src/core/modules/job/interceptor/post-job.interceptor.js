import { DefaultValidatorInterceptor } from 'core/infrastructure/interceptor';
import Joi from 'joi';

export const PostJobInterceptor = new DefaultValidatorInterceptor(
    Joi.object({
        title: Joi.string().required().label('Title'),
        description: Joi.string().required().label('Description'),
        job_type: Joi.string().valid('full_time', 'part_time', 'contract').required().label('Job Type'),
        work_mode: Joi.string().valid('remote', 'onsite', 'hybrid').required().label('Work Mode'),
        experience_required: Joi.string().required().label('Experience Required'),
        skills: Joi.array().items(
            Joi.object({
                name: Joi.string().required().label('Skill Name'),
                required: Joi.boolean().required().label('Skill Required'),
            })
        ).required().label('Skills'),
        salary_min: Joi.number().integer().min(0).required().label('Minimum Salary'),
        salary_max: Joi.number().integer().min(Joi.ref('salary_min')).required().label('Maximum Salary'),
        location: Joi.string().required().label('Location'),
        latitude: Joi.number().required().label('Latitude'),
        longitude: Joi.number().required().label('Longitude'),
        working_time: Joi.string().valid('full_time', 'part_time').required().label('Working Time'),
        status: Joi.string().valid('open', 'closed', 'paused').default('open').label('Status'),
        assistive_devices: Joi.array().items(Joi.string().uuid()).min(1).required().label('Assistive Devices'),
    })
);