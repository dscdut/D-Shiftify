import { Module } from 'packages/handler/Module';
import { JobController } from './job.controller';
import { ValidateJobIdInterceptor } from 'core/modules/job';
import { hasRecruiterRole } from 'core/modules/auth/guard/role.manager';
import { RecordUuid } from 'core/common/swagger/record-uuid';
import { PostJobInterceptor } from 'core/modules/job';

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
        }
    ]);
