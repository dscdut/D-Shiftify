import { ValidHttpResponse } from 'packages/handler/response/validHttp.response';
import {
    CreateConversationDto,
    CreateMessageDto,
    MessageQueryDto,
    ChatService,
} from 'core/modules/chat';

class Controller {
    constructor() {
        this.service = ChatService;
    }

    listConversations = async req => {
        const data = await this.service.listConversations(req.user.payload.id);
        return ValidHttpResponse.toOkResponse(data);
    };

    createConversation = async req => {
        const data = await this.service.createConversation(
            CreateConversationDto(req.body),
            req.user.payload.id,
        );

        return ValidHttpResponse.toCreatedResponse(data);
    };

    getConversationById = async req => {
        const data = await this.service.getConversationById(
            req.params.conversationId,
            req.user.payload.id,
        );

        return ValidHttpResponse.toOkResponse(data);
    };

    listMessages = async req => {
        const data = await this.service.listMessages(
            req.params.conversationId,
            req.user.payload.id,
            MessageQueryDto(req.query),
        );

        return ValidHttpResponse.toOkResponse(data);
    };

    createMessage = async req => {
        const data = await this.service.sendMessage(
            req.params.conversationId,
            req.user.payload.id,
            CreateMessageDto(req.body),
        );

        return ValidHttpResponse.toCreatedResponse(data);
    };
}

export const ChatController = new Controller();
