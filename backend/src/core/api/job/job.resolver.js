import { Module } from 'packages/handler/Module';
import { SwaggerDocument } from 'packages/swagger';
import { JobController } from './job.controller';
import { ValidateJobIdInterceptor } from 'core/modules/job';
import { hasRecruiterRole } from 'core/modules/auth/guard/role.manager';

const JobIdParam = SwaggerDocument.ApiParams({
    name: 'id',
    paramsIn: 'path',
    type: 'string',
    description: 'Job Id (UUID)',
});

export const JobResolver = Module.builder()
    .addPrefix({
        prefixPath: '/v1/jobs',
        tag: 'job',
        module: 'JobModule',
    })
    .register([
        {
            route: '/:id',
            method: 'get',
            params: [JobIdParam],
            interceptors: [ValidateJobIdInterceptor],
            controller: JobController.getJobById,
        },
        {
            route: '/:id',
            method: 'delete',
            params: [JobIdParam],
            interceptors: [ValidateJobIdInterceptor],
            controller: JobController.deletedJobById,
            preAuthorization: true,
            guards: [hasRecruiterRole]
        }
    ]);
