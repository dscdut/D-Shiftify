import { ApplicationsRepository } from '../repositories/application.repository';
import { CreateApplicationDto } from '../dto/index';
import { ConversationService } from 'core/modules/chat/services/conversation.service';
import { getTransaction } from 'core/database';

class Service {
    constructor() {
        this.repository = ApplicationsRepository;
    }

    async createOne(payload) {

        const data = CreateApplicationDto(payload);
        
        const existedApplication = await this.repository.findByJobAndCv( data.job_id, data.cv_id );

        if (existedApplication) {
            throw new Error('Application already exists');
        }

        const application =
            await this.repository.createOne({
                ...data,
                status: 'applied',
            });

        return application[0];
    }

    async getApplications(filters = {}) {

        return this.repository.findAll(filters);
    }

    async getById(id) {
        const application = await this.repository.findById(id);
        
        if (!application) {
            throw new Error('Application not found');
        }
        return application;
    }

  async updateStatus(id, status) {
    const validStatuses = ['applied', 'accepted', 'rejected'];

    if (!validStatuses.includes(status)) {
        throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    const trx = await getTransaction();

        try {
            //lay thong tin cua application
            const oldApplication = await this.repository.findById(id);

            if (!oldApplication) {
                throw new Error('Application not found');
            }
            //update status cua application
            const updatedApplication = await this.repository.updateStatus(id,status,trx );

            if (!updatedApplication || updatedApplication.length === 0) {
                throw new Error('Application not found or update failed');
            }

            // tao conversation khi status thanh accept 
            let conversation = null;

            if (status === 'accepted' && oldApplication.status !== 'accepted') {
                conversation = await ConversationService.createConversationFromApplication(
                    {   
                        status,
                        job_id: oldApplication.jobId,
                        cv_id: oldApplication.cvId,
                    },
                    trx
                );
            }

            await trx.commit();

            return {
                message: 'Application status updated successfully',
                application: updatedApplication[0],
                conversation,
            };
        } catch (error) {
            await trx.rollback();
            throw error;
        }
    }
}

export const ApplicationsService = new Service();