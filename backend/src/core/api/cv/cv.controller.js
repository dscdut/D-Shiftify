import { ValidHttpResponse } from 'packages/handler/response/validHttp.response';
import { CVService } from 'core/modules/cv/service/cv.service';

class Controller {
  constructor() {
    this.service = CVService;
  }

  createOne = async req => {
    const data = await this.service.createOne(req.body);

    return ValidHttpResponse.toCreatedResponse(data);
  };

  findById = async req => {
    const data = await this.service.getCvById(req.params.id);

    return ValidHttpResponse.toOkResponse(data);
  };

  updateCV = async req => {
    const data = await this.service.updateCV(req.params.id, req.body);

    return ValidHttpResponse.toOkResponse(data);
  };

}

export const CVController = new Controller();