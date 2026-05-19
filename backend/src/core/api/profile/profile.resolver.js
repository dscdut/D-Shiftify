import {
    UpdateProfileInterceptor,
    DeleteAccountInterceptor,
    AddDevicesInterceptor,
} from 'core/modules/profile';
import { Module } from 'packages/handler/Module';
import { hasCandidateRole } from 'core/modules/auth/guard/role.manager';
import { ProfileController } from './profile.controller';

export const ProfileResolver = Module.builder()
    .addPrefix({
        prefixPath: '/v1/profile',
        tag: 'profile',
        module: 'ProfileModule',
    })
    .register([
        {
            route: '/me',
            method: 'get',
            controller: ProfileController.getMyProfile,
            preAuthorization: true,
            guards: [hasCandidateRole],
        },
        {
            route: '/me',
            method: 'patch',
            interceptors: [UpdateProfileInterceptor],
            body: 'UpdateProfileDto',
            controller: ProfileController.updateMyProfile,
            preAuthorization: true,
            guards: [hasCandidateRole],
        },
        {
            route: '/me',
            method: 'delete',
            interceptors: [DeleteAccountInterceptor],
            body: 'DeleteAccountDto',
            controller: ProfileController.deleteMyAccount,
            preAuthorization: true,
            guards: [hasCandidateRole],
        },
        {
            route: '/me/devices',
            method: 'post',
            interceptors: [AddDevicesInterceptor],
            body: 'AddDevicesDto',
            controller: ProfileController.addDevices,
            preAuthorization: true,
            guards: [hasCandidateRole],
        },
        {
            route: '/assistive-devices',
            method: 'get',
            controller: ProfileController.getAssistiveDevices,
            preAuthorization: true,
            guards: [hasCandidateRole],
        },
    ]);
