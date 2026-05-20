import { ValidHttpResponse } from '../../../packages/handler/response/validHttp.response';
import { matchJobsForProfile } from '../../modules/ai/agents/match/match.agent';

class Controller {
    matchForProfile = async req => {
        const { profileId } = req.params;
        const matches = await matchJobsForProfile(profileId);
        return ValidHttpResponse.toOkResponse({
            success: true,
            data: matches,
            message: 'Tìm việc làm phù hợp thành công.'
        });
    };
}

export const AIController = new Controller();
