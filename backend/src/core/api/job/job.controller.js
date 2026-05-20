import { JobService } from "../../modules/job/service/job.service";
import { ValidHttpResponse } from '../../../packages/handler/response/validHttp.response';

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
}

export const JobController = new Controller();