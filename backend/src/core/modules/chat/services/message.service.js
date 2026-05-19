import { MessagesRepository, ParticipantsRepository, ConversationsRepository } from '../repositories/index.js';
import { MessageDto, CreateMessageDto } from '../dto/index.js';
import { MESSAGE } from './message.enum.js';

class Service {
    constructor() {
        this.messageRepository = MessagesRepository;
        this.participantRepository = ParticipantsRepository;
        this.conversationRepository = ConversationsRepository;
    }

    async createMessage(payload, senderId) {
        const participant = await this.participantRepository.findParticipant(
            payload.conversationId,
            senderId
        );

        if (!participant) {
            throw new Error(MESSAGE.FORBIDDEN);
        }

        const data = CreateMessageDto(payload);

        const message = await this.messageRepository.create({
            ...data,
            conversation_id: payload.conversationId,
            sender_id: senderId,
        });

        await this.conversationRepository.update(
            payload.conversationId,
            {}
        );

        return MessageDto(message);
    }

    async getMessages(conversationId, userId) {
        const participant = await this.participantRepository.findParticipant(
            conversationId,
            userId
        );

        if (!participant) {
            throw new Error(MESSAGE.FORBIDDEN);
        }

        const messages = await this.messageRepository.findAllByConversationId(conversationId);

        return messages.map(
            (message) => MessageDto(message)
        );
    }
}

export const MessageService = new Service();