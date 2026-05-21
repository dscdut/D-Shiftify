import { DefaultValidatorInterceptor } from 'core/infrastructure/interceptor';
import Joi from 'joi';

export const GetAdminJobsInterceptor = new DefaultValidatorInterceptor(
    Joi.object({
        page: Joi.number().integer().min(1).default(1).label('Page'),
        limit: Joi.number().integer().min(1).max(100).default(10).label('Limit'),
        search: Joi.string().optional().allow('').label('Search'),
        status: Joi.string().valid('open', 'closed', 'paused').optional().allow('').label('Status'),
    })
);
