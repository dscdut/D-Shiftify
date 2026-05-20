import { Module } from 'packages/handler/Module';
import { AIController } from './ai.controller';

export const AIResolver = Module.builder()
    .addPrefix({
        prefixPath: '/ai',
        tag: 'ai',
        module: 'AIModule'
    })
    .register([
        {
            route: '/match/:profileId',
            method: 'get',
            controller: AIController.matchForProfile,
            preAuthorization: true
        }
    ]);
