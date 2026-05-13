import { CVRepository } from '../repository/cv.repository.js';
import { UserDeviceRepository } from '../repository/user-device.repository.js';
import { CreateCVDto } from '../dto/create-cv.dto.js';

class Service {
    constructor() {
        this.repository = CVRepository;
    }

}

export const CVService = new Service();