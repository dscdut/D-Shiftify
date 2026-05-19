import { Module } from 'packages/handler/Module';
//import { hasCandidateRole , hasRecruiter } from 'core/modules/auth/guard';
import {CreateApplicationInterceptor,UpdateApplicationStatusInterceptor} from 'core/modules/applications/interceptors/index';              
import { ApplicationsController } from './applications.controller';

export const ApplicationsResolver = Module.builder()
    .addPrefix({
        prefixPath: '/applications',
        tag: 'applications',
        module: 'ApplicationsModule',
    })
    .register([

        {
            route: '/',
            method: 'post',
            body: 'CreateApplicationDto',
            // guards: [hasCandidate],
            interceptors: [CreateApplicationInterceptor],
            controller: ApplicationsController.createApplication,
            // preAuthorization: true,
        },

        {
            route: '/',
            method: 'get',
            // guards: [hasRecruiter],
            controller: ApplicationsController.getApplications,
            // preAuthorization: true,
        },

        {
            route: '/:id',
            method: 'patch',
            body: 'UpdateApplicationStatusDto',
            // guards: [hasRecruiter], or hasCandidateRole
            interceptors: [UpdateApplicationStatusInterceptor],
            controller: ApplicationsController.updateApplicationStatus,
            // preAuthorization: true,
        },
    ]);
