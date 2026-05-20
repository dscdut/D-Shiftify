import { JobService } from "../../modules/job/service/job.service";
import { ValidHttpResponse } from '../../../packages/handler/response/validHttp.response';
import { getUserContext } from 'packages/authModel/module/user';

class Controller {
    constructor() {
        this.service = JobService;
    }

    getJobById = async req => {
        const jobId = req.params.id;
        const data = await this.service.getJobById(jobId);

        return ValidHttpResponse.toOkResponse({
            status: 'success',
            message: 'Get job successfully',
            data,
        });
    }

    deletedJobById = async req => {
        const jobId = req.params.id;
        const userId = getUserContext(req).payload.id;
        const data = await this.service.deleteJobById(jobId, userId);

        return ValidHttpResponse.toOkResponse({
            status: 'success',
            message: data.message,
        });
    }
}

export const JobController = new Controller();