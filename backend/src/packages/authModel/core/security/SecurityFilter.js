import { JwtAuthAdapter } from '../../module/authentication/JwtAuthAdapter';
import { InValidHttpResponse } from '../../../handler/response/invalidHttp.response';

export class SecurityFilter {
    async filter(req, res, next) {
        try {
            await JwtAuthAdapter
                .builder()
                .collectRequest(req)
                .transfer(req);
        } catch (e) {
            return new InValidHttpResponse(e.status, e.code, e.message)
                .toResponse(res);
        }
        return next();
    }
}
