import { ValidHttpResponse } from '../../../packages/handler/response/validHttp.response';
import { ConversationService } from 'core/modules/chat/services/conversation.service';
import { MessageService } from 'core/modules/chat/services/message.service';
import { CreateMessageDto, UpdateMessageDto } from 'core/modules/chat/dto';

class Controller {
    constructor() {
        this.conversationService = ConversationService;
        this.messageService = MessageService;
    }

    getConversationsbyId= async req => {
        const data = await this.conversationService.getUserConversations(req.user.id);
        return ValidHttpResponse.toOkResponse(data);
    };

    getMessages = async req => {

        const conversationId = req.params.id;
        const userId = req.auth.user.id;

        const data = await this.messageService.getMessages(conversationId,userId);

        return ValidHttpResponse.toOkResponse(data);
    };

    getMessageById = async req => {
        const data = await this.messageService.getMessageById(
            req.params.messageId,
            req.user.id
        );

        return ValidHttpResponse.toOkResponse(data);
    };

}

export const ChatController = new Controller();