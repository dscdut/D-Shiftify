import { Module } from 'packages/handler/Module';
import { hashRole } from 'core/modules/auth/guard';
import { CreateCVInterceptor, UpdateCVInterceptor } from 'core/modules/cv/interceptor';
import { CVController } from './cv.controller';

export const CVResolver = Module.builder()
    .addPrefix({
        prefixPath: '/cv',
        tag: 'cv',
        module: 'CVModule',
    })
    .register([
        {
            route: '/',
            method: 'post',
            body: 'CreateCVDto',
            // guards: [hashRole],
            interceptors: [CreateCVInterceptor],
            controller: CVController.createOne,
        },
        {
            route: '/:id',
            method: 'get',
            controller: CVController.findById,
        },
        {
            route: '/:id',
            method: 'put',
            body: 'UpdateCVDto',
            interceptors: [UpdateCVInterceptor],
            controller: CVController.updateCV,
        },
    ]);