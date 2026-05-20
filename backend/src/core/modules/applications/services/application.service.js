import { ApplicationsRepository } from '../repositories/application.repository';
import { CreateApplicationDto , ApplicationDto } from '../dto/index';
// import { ConversationService } from 'core/modules/chat/services/conversation.service';
import { getTransaction } from 'core/database';
import { APPLICATION_STATUS } from './application.enum';
import { NotFoundException, DuplicateException, BadRequestException} from 'packages/httpException';

class Service {
    constructor() {
        this.repository = ApplicationsRepository;
    }

    async createOne(payload) {

        const data = CreateApplicationDto(payload);
        
        const existedApplication = await this.repository.findByJobAndCv( data.job_id, data.cv_id );

        if (existedApplication) {
            throw new DuplicateException();
        }

        const application =
            await this.repository.createOne({
                ...data,
                status: APPLICATION_STATUS.APPLIED,
            });

        return application[0];
    }

    async getApplications(page, size) {
        const totalResult = await this.repository.getTotalCount();
        const total = totalResult?.total ? parseInt(totalResult.total, 10) : 0; 

        const data = await this.repository.getAll(page, size);
        return {
            content: data.map(e => ApplicationDto(e)),
            total,
            size
        };
    }

    async getById(id) {
        const application = await this.repository.findById(id);
        
        if (!application) {
            throw new NotFoundException();
        }
        return application;
    }

    async updateStatus(id, status) {
        const trx = await getTransaction();

        try {
            //get application
            const oldApplication = await this.repository.findById(id,trx);

            if (!oldApplication) {
                throw new NotFoundException();
            }
            //update status application
            const updatedApplication = await this.repository.updateStatus(id,status,trx );

            if (!updatedApplication || updatedApplication.length === 0) {
                throw new Error('Application not found or update failed');
            }

            // create conversation if status is accepted and old status is not accepted
             let conversation = null;

            if (status === APPLICATION_STATUS.ACCEPTED && oldApplication.status !== APPLICATION_STATUS.ACCEPTED) {
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