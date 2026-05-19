import { ValidHttpResponse } from '../../../packages/handler/response/validHttp.response';
import { ApplicationsService } from 'core/modules/applications/services/application.service';

class Controller {
    constructor() {
        this.service = ApplicationsService;
    }

    createApplication = async req => {
        const data = await this.service.createOne( req.body );
        return ValidHttpResponse.toCreatedResponse(data);
    };

    getApplications = async req => {
        const data = await this.service.getApplications(req.query);
        return ValidHttpResponse.toOkResponse(data);
    };

    updateApplicationStatus = async req => {
        const data = await this.service.updateStatus(req.params.id, req.body.status);

        return ValidHttpResponse.toOkResponse(data);
    };
}

export const ApplicationsController = new Controller();