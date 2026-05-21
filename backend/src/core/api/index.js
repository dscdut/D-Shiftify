import { MediaResolver } from 'core/api/media';
import { UserResolver } from 'core/api/user/user.resolver';
import { ApiDocument } from 'core/config/swagger.config';
import { HandlerResolver } from '../../packages/handler/HandlerResolver';
import { AuthResolver } from './auth/auth.resolver';
import { ProfileResolver } from './profile/profile.resolver';
import { JobResolver, AdminJobResolver, RecruiterJobResolver } from './job/job.resolver';

export const ModuleResolver = HandlerResolver
    .builder()
    .addSwaggerBuilder(ApiDocument)
    .addModule([
        AuthResolver,
        UserResolver,
        MediaResolver,
        ProfileResolver,
        JobResolver,
        AdminJobResolver,
        RecruiterJobResolver,
    ]);
