import { ConversationsRepository, ParticipantsRepository } from '../repositories/index.js';
import { BadRequestException, ForbiddenException, NotFoundException } from 'packages/httpException';
import { logger } from '../../../../packages/logger';
import { MESSAGE } from './message.enum.js';
class Service {
    constructor() {
        this.conversationRepository = ConversationsRepository;
        this.participantRepository = ParticipantsRepository;
        this.logger = logger;
    }

    async createConversationFromApplication(application, trx) {
        try {
            if (application.status !== 'accepted') {
                throw new BadRequestException(MESSAGE.APPLICATION_MUST_BE_ACCEPTED);
            }
// job cua vu , sau vu lam file roi lay lai sài , chừ làm đỡ trước test :
// const recruiter = await this.jobRepository .findRecruiterUserIdByJobId( application.job_id,trx,);
            const recruiter = await trx('jobs').innerJoin(
                'companies',
                'companies.id',
                'jobs.company_id'
            ).select(
                'companies.user_id as recruiterUserId'
            ).where(
                'jobs.id',
                application.job_id
            ).first();
// -------------------------------------------
            if (!recruiter) {
                throw new NotFoundException(MESSAGE.RECRUITER_NOT_FOUND);
            }
// cvs cua thu chua sửa xong , sau lam file roi lay lai sài , chừ làm đỡ trước test :
// const candidate =await this.cvRepository.findCandidateUserIdByCvId(application.cv_id,trx,);
            const candidate = await trx('cvs').innerJoin(
                'profiles',
                'profiles.id',
                'cvs.profile_id'
            ).select(
                'profiles.user_id as candidateUserId'
            ).where(
                'cvs.id',
                application.cv_id
            ).first();
// -------------------------------------------
            if (!candidate) {
                throw new NotFoundException(MESSAGE.CANDIDATE_NOT_FOUND);
            }

            const conversation = await this.conversationRepository.create({},trx);

            await this.participantRepository.create(
                {
                    conversation_id: conversation.id,
                    user_id: recruiter.recruiterUserId,
                },
                trx
            );

            await this.participantRepository.create(
                {
                    conversation_id: conversation.id,
                    user_id: candidate.candidateUserId,
                },
                trx
            );

            return conversation;

        } catch (error) {
            this.logger.error(error.message);
            throw error;
        }
    }

    async getUserConversations(userId) {
        try {
            return await this.conversationRepository.findAllByUserId(userId);

        } catch (error) {
            this.logger.error(error.message);
            throw error;
        }
    }

    async getConversationById(conversationId, userId) {
        try {
            const participant = await this.participantRepository.findParticipant(conversationId,userId);

            if (!participant) {
                throw new ForbiddenException(
                    MESSAGE.USER_NOT_IN_CONVERSATION
                );
            }

            const conversation = await this.conversationRepository.findById(conversationId);

            if (!conversation) {
                throw new NotFoundException(MESSAGE.CONVERSATION_NOT_FOUND);
            }

            const participants = await this.participantRepository.findAllByConversationId(conversationId);

            return {
                ...conversation,
                participants,
            };

        } catch (error) {
            this.logger.error(error.message);
            throw error;
        }
    }
}

export const ConversationService = new Service();