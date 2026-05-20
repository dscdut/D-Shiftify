import { Module } from 'packages/handler/Module';
import { SwaggerDocument } from 'packages/swagger';
import { JobController } from './job.controller';
import { ValidateJobIdInterceptor } from 'core/modules/job';

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
    ]);
