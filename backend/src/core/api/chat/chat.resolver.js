import { Module } from 'packages/handler/Module';
import { ChatController } from './chat.controller';
import { CreateMessageInterceptor , JoinConversationInterceptor} from 'core/modules/chat/interceptor';

export const ChatResolver = Module.builder()
    .addPrefix({ 
        prefixPath: '/chat',
        tag: 'chat',
        module: 'ChatModule',
    })
    .register([
                                                                                 
        {
            route: '/conversations',
            method: 'get',
            controller: ChatController.getConversationsbyId,
            preAuthorization: true,
        },

        {
            route: '/conversations/:id/messages',
            method: 'get',
            controller: ChatController.getMessages,
            preAuthorization: true,
        },

        {
            route: '/messages/:messageId',
            method: 'get',
            controller: ChatController.getMessageById,
            preAuthorization: true,
        },

    ]);