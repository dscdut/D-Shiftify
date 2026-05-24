import { DefaultValidatorInterceptor } from 'core/infrastructure/interceptor';
import Joi from 'joi';

export const GetJobsInterceptor = new DefaultValidatorInterceptor(
    Joi.object({
        page: Joi.number().integer().min(1).default(1).label('Page'),
        limit: Joi.number().integer().min(1).max(100).default(10).label('Limit'),
        search: Joi.string().optional().allow('').label('Search'),
        job_type: Joi.string().optional().allow('').label('Job Type'),
        work_mode: Joi.string().valid('remote', 'onsite', 'hybrid').optional().allow('').label('Work Mode'),
        location: Joi.string().optional().allow('').label('Location'),
        min_salary: Joi.number().integer().min(0).optional().label('Minimum Salary'),
    })
);