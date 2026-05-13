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
    const data = await this.service.findById(req.params.id);

    return ValidHttpResponse.toOkResponse(data);
  };

  updateOne = async req => {
    const data = await this.service.updateOne(
      req.params.id,
      req.body,
    );

    return ValidHttpResponse.toOkResponse(data);
  };

  deleteOne = async req => {
    const data = await this.service.deleteOne(req.params.id);

    return ValidHttpResponse.toOkResponse(data);
  };
}

export const CVController = new Controller();