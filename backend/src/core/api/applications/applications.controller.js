import { ValidHttpResponse } from '../../../packages/handler/response/validHttp.response';
import { ApplicationsService } from 'core/modules/applications/services/application.service';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from 'core/common/constants/index.js';
import { PaginationApplicationDto } from 'core/modules/applications/dto/index.js';
class Controller {
    constructor() {
        this.service = ApplicationsService;
    }

    createApplication = async req => {
        const data = await this.service.createOne( req.body );
        return ValidHttpResponse.toCreatedResponse(data);
    };

    getApplications = async req => {
        const page = req.query.page || DEFAULT_PAGE;
        const size = req.query.size || DEFAULT_PAGE_SIZE;

        const data = await this.service.getApplications(page, size);

        return ValidHttpResponse.toOkResponse(PaginationApplicationDto(data));
    };

    updateApplicationStatus = async req => {
        const data = await this.service.updateStatus(req.params.id, req.body.status);

        return ValidHttpResponse.toOkResponse(data);
    };
}

export const ApplicationsController = new Controller();