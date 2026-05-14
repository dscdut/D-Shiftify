import {
    BadRequestException,
    NotFoundException,
} from 'packages/httpException';
import { ForbiddenException } from 'packages/httpException/ForbiddenException';
import { getTransaction } from 'core/database';
import { ConversationRepository } from '../chat.repository';
import { ParticipantRepository } from '../participant.repository';
import { MessageRepository } from '../message.repository';
import { ChatUserRepository } from '../chatUser.repository';
import { ChatEventPublisher } from '../socket/chat-event.publisher';

class Service {
    constructor() {
        this.conversationRepository = ConversationRepository;
        this.participantRepository = ParticipantRepository;
        this.messageRepository = MessageRepository;
        this.userRepository = ChatUserRepository;
        this.publisher = ChatEventPublisher;
        this.transactionProvider = getTransaction;
    }

    async listConversations(userId) {
        const conversationIds = await this.getConversationIdsForUser(userId);

        if (!conversationIds.length) {
            return [];
        }

        const conversations = await this.conversationRepository.findByIds(conversationIds);
        return this.#hydrateConversations(conversations);
    }

    async getConversationById(conversationId, userId) {
        await this.#assertConversationAccess(conversationId, userId);

        const conversation = await this.conversationRepository.findById(conversationId);
        return this.#hydrateConversation(conversation);
    }

    async createConversation(createConversationDto, userId) {
        const participantIds = this.#normalizeParticipantIds(
            createConversationDto.participantIds,
            userId,
        );

        if (participantIds.length < 2) {
            throw new BadRequestException(
                'A conversation must contain at least 2 participants',
            );
        }

        const users = await this.userRepository.findByIds(participantIds);

        if (users.length !== participantIds.length) {
            throw new NotFoundException('One or more participants were not found');
        }

        const trx = await this.transactionProvider();

        try {
            const conversation = await this.conversationRepository.createOne(trx);

            await this.participantRepository.insertMany(
                participantIds.map(participantId => ({
                    conversation_id: conversation.id,
                    user_id: participantId,
                })),
                trx,
            );

            await trx.commit();

            const createdConversation = await this.#hydrateConversation(conversation);
            this.publisher.publishConversationCreated(createdConversation);

            return createdConversation;
        } catch (error) {
            await trx.rollback();
            throw error;
        }
    }

    async listMessages(conversationId, userId, queryDto) {
        await this.#assertConversationAccess(conversationId, userId);

        const messages = await this.messageRepository.findByConversationId(
            conversationId,
            queryDto,
        );
        const normalizedMessages = messages
            .slice()
            .reverse()
            .map(message => this.#mapMessage(message));

        return {
            items: normalizedMessages,
            nextCursor:
                messages.length === queryDto.limit && messages.length > 0
                    ? messages[messages.length - 1].createdAt
                    : null,
        };
    }

    async sendMessage(conversationId, userId, createMessageDto) {
        await this.#assertConversationAccess(conversationId, userId);

        const payload = this.#normalizeMessagePayload(createMessageDto);
        const insertedMessage = await this.messageRepository.createOne({
            conversation_id: conversationId,
            sender_id: userId,
            content: payload.content,
            voice_url: payload.voiceUrl,
            type: payload.type,
        });

        const createdMessage = await this.messageRepository.findById(insertedMessage.id)
            || {
                id: insertedMessage.id,
                conversationId: insertedMessage.conversation_id,
                senderId: insertedMessage.sender_id,
                content: insertedMessage.content,
                voiceUrl: insertedMessage.voice_url,
                type: insertedMessage.type,
                createdAt: insertedMessage.created_at,
                updatedAt: insertedMessage.updated_at,
                deletedAt: insertedMessage.deleted_at,
                senderEmail: null,
                senderRole: null,
                senderFullName: null,
            };

        const data = this.#mapMessage(createdMessage);
        this.publisher.publishMessage(data);

        return data;
    }

    async getConversationIdsForUser(userId) {
        return this.participantRepository.findConversationIdsByUser(userId);
    }

    async #assertConversationAccess(conversationId, userId) {
        const conversation = await this.conversationRepository.findById(conversationId);

        if (!conversation) {
            throw new NotFoundException('Conversation not found');
        }

        const isParticipant = await this.participantRepository.isParticipant(
            conversationId,
            userId,
        );

        if (!isParticipant) {
            throw new ForbiddenException(
                'You are not a participant of this conversation',
            );
        }
    }

    async #hydrateConversations(conversations = []) {
        if (!conversations.length) {
            return [];
        }

        const conversationIds = conversations.map(conversation => conversation.id);
        const [participants, messages] = await Promise.all([
            this.participantRepository.findByConversationIds(conversationIds),
            this.messageRepository.findByConversationIds(conversationIds),
        ]);

        const participantsByConversation = participants.reduce((acc, participant) => {
            if (!acc[participant.conversationId]) {
                acc[participant.conversationId] = [];
            }

            acc[participant.conversationId].push(this.#mapParticipant(participant));
            return acc;
        }, {});

        const latestMessageByConversation = messages.reduce((acc, message) => {
            if (!acc[message.conversationId]) {
                acc[message.conversationId] = this.#mapMessage(message);
            }

            return acc;
        }, {});

        return conversations
            .map(conversation => ({
                ...conversation,
                participants: participantsByConversation[conversation.id] || [],
                lastMessage: latestMessageByConversation[conversation.id] || null,
            }))
            .sort((left, right) => {
                const leftDate = left.lastMessage?.createdAt || left.updatedAt;
                const rightDate = right.lastMessage?.createdAt || right.updatedAt;

                return new Date(rightDate) - new Date(leftDate);
            });
    }

    async #hydrateConversation(conversation) {
        const [participants, messages] = await Promise.all([
            this.participantRepository.findByConversationId(conversation.id),
            this.messageRepository.findByConversationId(conversation.id, { limit: 1 }),
        ]);

        return {
            ...conversation,
            participants: participants.map(participant => this.#mapParticipant(participant)),
            lastMessage: messages[0] ? this.#mapMessage(messages[0]) : null,
        };
    }

    #normalizeParticipantIds(participantIds = [], userId) {
        return [...new Set([...participantIds, userId].map(value => value.trim()))];
    }

    #normalizeMessagePayload(createMessageDto) {
        const content = typeof createMessageDto.content === 'string'
            ? createMessageDto.content.trim()
            : null;
        const voiceUrl = createMessageDto.voiceUrl || null;
        const type = createMessageDto.type || 'text';

        if (!content && !voiceUrl) {
            throw new BadRequestException('Message content or voice URL is required');
        }

        if (type === 'voice' && !voiceUrl) {
            throw new BadRequestException('Voice messages require voiceUrl');
        }

        if (type === 'text' && !content) {
            throw new BadRequestException('Text messages require content');
        }

        return {
            content: content || null,
            voiceUrl,
            type,
        };
    }

    #mapParticipant(participant) {
        return {
            id: participant.userId,
            email: participant.email,
            role: participant.role,
            fullName: participant.fullName,
            joinedAt: participant.createdAt,
        };
    }

    #mapMessage(message) {
        return {
            id: message.id,
            conversationId: message.conversationId,
            content: message.content,
            voiceUrl: message.voiceUrl,
            type: message.type,
            createdAt: message.createdAt,
            updatedAt: message.updatedAt,
            deletedAt: message.deletedAt,
            sender: {
                id: message.senderId,
                email: message.senderEmail,
                role: message.senderRole,
                fullName: message.senderFullName,
            },
        };
    }
}

export const ChatService = new Service();
