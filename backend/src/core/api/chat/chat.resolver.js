import { Module } from 'packages/handler/Module';
import {
    CreateConversationInterceptor,
    CreateMessageInterceptor,
    ConversationIdParamInterceptor,
    MessageQueryInterceptor,
} from 'core/modules/chat';
import { ChatController } from './chat.controller';

export const ChatResolver = Module.builder()
    .addPrefix({
        prefixPath: '/chats',
        tag: 'chats',
        module: 'ChatModule',
    })
    .register([
        {
            route: '/conversations',
            method: 'get',
            controller: ChatController.listConversations,
            preAuthorization: true,
        },
        {
            route: '/conversations',
            method: 'post',
            interceptors: [CreateConversationInterceptor],
            body: 'CreateConversationDto',
            controller: ChatController.createConversation,
            preAuthorization: true,
        },
        {
            route: '/conversations/:conversationId',
            method: 'get',
            interceptors: [ConversationIdParamInterceptor],
            controller: ChatController.getConversationById,
            preAuthorization: true,
        },
        {
            route: '/conversations/:conversationId/messages',
            method: 'get',
            interceptors: [
                ConversationIdParamInterceptor,
                MessageQueryInterceptor,
            ],
            controller: ChatController.listMessages,
            preAuthorization: true,
        },
        {
            route: '/conversations/:conversationId/messages',
            method: 'post',
            interceptors: [
                ConversationIdParamInterceptor,
                CreateMessageInterceptor,
            ],
            body: 'CreateMessageDto',
            controller: ChatController.createMessage,
            preAuthorization: true,
        },
    ]);
