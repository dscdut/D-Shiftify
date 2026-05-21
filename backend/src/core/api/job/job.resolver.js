import { Module } from 'packages/handler/Module';
import { ValidateJobIdInterceptor, PostJobInterceptor, UpdateJobInterceptor } from 'core/modules/job';
import { hasRecruiterRole } from 'core/modules/auth/guard/role.manager';
import { RecordUuid } from 'core/common/swagger/record-uuid';

import { JobController } from './job.controller';

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
            params: [RecordUuid],
            interceptors: [ValidateJobIdInterceptor],
            controller: JobController.getJobById,
        },
        {
            route: '/:id',
            method: 'delete',
            params: [RecordUuid],
            interceptors: [ValidateJobIdInterceptor],
            controller: JobController.deletedJobById,
            preAuthorization: true,
            guards: [hasRecruiterRole]
        },
        {
            route: '/',
            method: 'post',
            body: 'PostJobDto',
            interceptors: [PostJobInterceptor],
            controller: JobController.createJob,
            preAuthorization: true,
            guards: [hasRecruiterRole]
        },
        {
            route: '/:id',
            method: 'patch',
            params: [RecordUuid],
            body: 'UpdateJobDto',
            interceptors: [ValidateJobIdInterceptor, UpdateJobInterceptor],
            controller: JobController.updateJobById,
            preAuthorization: true,
            guards: [hasRecruiterRole]
        }
    ]);
