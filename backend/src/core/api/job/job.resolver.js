import { Module } from 'packages/handler/Module';
import { ValidateJobIdInterceptor, PostJobInterceptor, UpdateJobInterceptor, GetJobsInterceptor, GetAdminJobsInterceptor, GetRecruiterJobsInterceptor } from 'core/modules/job';
import { hasRecruiterRole, hasAdminRole } from 'core/modules/auth/guard/role.manager';
import { RecordUuid } from 'core/common/swagger/record-uuid';
import { QueryCriteriaDocument } from 'core/common/swagger/filter';

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
        },
        {
            route: '/',
            method: 'get',
            params: [
                QueryCriteriaDocument.page(),
                QueryCriteriaDocument.limit(),
                QueryCriteriaDocument.search('Search by title'),
                QueryCriteriaDocument.job_type(),
                QueryCriteriaDocument.work_mode(),
                QueryCriteriaDocument.location(),
                QueryCriteriaDocument.min_salary()
            ],
            interceptors: [GetJobsInterceptor],
            controller: JobController.getJobs,
        }
    ]);

export const AdminJobResolver = Module.builder()
    .addPrefix({
        prefixPath: '/v1/admin/jobs',
        tag: 'job',
        module: 'AdminJobModule',
    })
    .register([
        {
            route: '/',
            method: 'get',
            params: [
                QueryCriteriaDocument.page(),
                QueryCriteriaDocument.limit(),
                QueryCriteriaDocument.search('Search by title or company name'),
                QueryCriteriaDocument.status('Filter by status (open, closed, paused)'),
            ],
            interceptors: [GetAdminJobsInterceptor],
            controller: JobController.getAdminJobs,
            preAuthorization: true,
            guards: [hasAdminRole],
        }
    ]);

export const RecruiterJobResolver = Module.builder()
    .addPrefix({
        prefixPath: '/v1/recruiter/jobs',
        tag: 'job',
        module: 'RecruiterJobModule',
    })
    .register([
        {
            route: '/',
            method: 'get',
            params: [
                QueryCriteriaDocument.page(),
                QueryCriteriaDocument.limit(),
                QueryCriteriaDocument.status('Filter by status (open, closed, paused)'),
            ],
            interceptors: [GetRecruiterJobsInterceptor],
            controller: JobController.getRecruiterJobs,
            preAuthorization: true,
            guards: [hasRecruiterRole],
        }
    ]);

