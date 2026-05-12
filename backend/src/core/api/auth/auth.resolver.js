import {
    LoginInterceptor,
    RegisterInterceptor,
    RefreshInterceptor,
    ForgotPasswordInterceptor,
    ResetPasswordInterceptor,
    LogoutInterceptor,
} from 'core/modules/auth';
import { Module } from 'packages/handler/Module';
import { AuthController } from './auth.controller';

export const AuthResolver = Module.builder()
    .addPrefix({
        prefixPath: '/auth/v1',
        tag: 'auth',
        module: 'AuthModule',
    })
    .register([
        {
            route: '/login',
            method: 'post',
            interceptors: [LoginInterceptor],
            body: 'LoginDto',
            controller: AuthController.login,
        },
        {
            route: '/register',
            method: 'post',
            interceptors: [RegisterInterceptor],
            body: 'RegisterDto',
            controller: AuthController.register,
        },
        {
            route: '/refresh',
            method: 'post',
            interceptors: [RefreshInterceptor],
            body: 'RefreshDto',
            controller: AuthController.refresh,
        },
        {
            route: '/forgot-password',
            method: 'post',
            interceptors: [ForgotPasswordInterceptor],
            body: 'ForgotPasswordDto',
            controller: AuthController.forgotPassword,
        },
        {
            route: '/reset-password',
            method: 'post',
            interceptors: [ResetPasswordInterceptor],
            body: 'ResetPasswordDto',
            controller: AuthController.resetPassword,
        },
        {
            route: '/logout',
            method: 'post',
            interceptors: [LogoutInterceptor],
            body: 'LogoutDto',
            controller: AuthController.logout,
        },
    ]);
