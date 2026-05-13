import { CVRepository } from '../repository/cv.repository.js';
import { CreateCVDto } from "../dto/createCV.dto.js";
import { UserDeviceRepository } from '../../user/repository/user_devices.repository.js';
class Service {
    constructor() {
        this.repository = CVRepository;
    }

    async getCVById(id) {
        const cv = await this.repository.getCVById(id);
        if (!cv) {
            throw new Error('CV not found');
        }
        return cv;
    }

async createOne(cvData) {

    const trx = await transaction.start();
    try {
        const cv = await this.repository.createCV(CreateCVDto(cvData),trx);

        if (cvData.deviceIds?.length) {
            await UserDeviceRepository.createUserDevices(cvData.profileId,cvData.deviceIds,trx );
        }
        
        await trx.commit();
        return cv;
    } catch (e) {
        await trx.rollback();
        throw e;
    }
}

    async getListCVByProfile(profileId) {
        const cvs = await this.repository.getCVsByProfileId(profileId);
        return cvs;
    }

    async updateOne(id, cvData) {
        const updatedCV = await this.repository.updateCV(id, cvData);
        if (!updatedCV || updatedCV.length === 0) {
            throw new Error('CV not found or update failed');
        }
        return updatedCV[0];
    }

    async deleteOne(id) {
        const deletedCV = await this.repository.deleteCV(id);
        if (!deletedCV || deletedCV.length === 0) {
            throw new Error('CV not found or delete failed');
        }
        return deletedCV[0];
    }
}
export const CVService = new Service();