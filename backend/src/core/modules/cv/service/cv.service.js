import { CVRepository } from '../repository/cv.repository.js';
import { getTransaction } from 'core/database';
import { CreateCVDto , UpdateCVDto} from "../dto/index.js";
import { UserDeviceRepository } from '../../user/repository/user_devices.repository.js';
class Service {
    constructor() {
        this.repository = CVRepository;
    }

    async createOne(cvData) {

        const trx = await getTransaction();
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
    
    async getCvById(id) {
        const cv = await this.repository.findById(id);
        if (!cv) {
            throw new Error('CV not found');
        }
        return cv;
    }

    async updateCV(id, cvData) {
        const trx = await getTransaction();
        try {
            // update cv
            const updatedCV = await this.repository.updateCV(id,UpdateCVDto(cvData),trx);

            if (!updatedCV || updatedCV.length === 0) {
                throw new Error('CV not found or update failed');
            }
            // update devices
            if (cvData.deviceIds !== undefined) {
                await UserDeviceRepository.deleteByProfileId(cvData.profileId,trx);

                if (cvData.deviceIds.length) {
                    await UserDeviceRepository.createUserDevices(cvData.profileId,cvData.deviceIds,trx);
                }
            }

            await trx.commit();
            return updatedCV[0];

        } catch (e) {
            await trx.rollback();
            throw e;
        }
    }
}
export const CVService = new Service();
