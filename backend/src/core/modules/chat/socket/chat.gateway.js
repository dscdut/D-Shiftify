import { Server } from 'socket.io';
import { JwtValidator } from 'packages/authModel/module/authentication/JwtValidator';
import { ForbiddenException } from 'packages/httpException/ForbiddenException';
import { logger } from 'packages/logger';
import { ChatService } from '../services/chat.service';
import {
    ChatEventPublisher,
    getConversationRoom,
    getUserRoom,
} from './chat-event.publisher';

const extractToken = handshake => (
    handshake?.auth?.token
    || handshake?.headers?.authorization
    || handshake?.query?.token
);

const createAck = ack => (payload => {
    if (typeof ack === 'function') {
        ack(payload);
    }
});

const respondSocketError = (socket, ack, error) => {
    const message = error?.message || 'Internal server error';
    createAck(ack)({ ok: false, error: message });
    socket.emit('chat:error', { message });
};

export const initializeChatGateway = server => {
    const io = new Server(server, {
        cors: {
            origin: '*',
        },
    });

    io.use((socket, next) => {
        try {
            const payload = JwtValidator
                .builder()
                .applyToken(extractToken(socket.handshake))
                .validate()
                .getPayload();

            if (!payload?.id) {
                throw new ForbiddenException('Unauthorized socket connection');
            }

            socket.user = payload;
            return next();
        } catch (error) {
            return next(error);
        }
    });

    io.on('connection', async socket => {
        const userId = socket.user.id;
        socket.join(getUserRoom(userId));

        try {
            const conversationIds = await ChatService.getConversationIdsForUser(userId);
            conversationIds.forEach(conversationId => {
                socket.join(getConversationRoom(conversationId));
            });

            socket.emit('chat:ready', {
                userId,
                conversationIds,
            });
        } catch (error) {
            logger.error(error.message);
            socket.emit('chat:error', { message: error.message });
        }

        socket.on('chat:conversation:join', async (payload = {}, ack) => {
            try {
                const conversation = await ChatService.getConversationById(
                    payload.conversationId,
                    userId,
                );

                socket.join(getConversationRoom(conversation.id));
                createAck(ack)({ ok: true, data: conversation });
            } catch (error) {
                respondSocketError(socket, ack, error);
            }
        });

        socket.on('chat:conversation:leave', (payload = {}, ack) => {
            if (payload.conversationId) {
                socket.leave(getConversationRoom(payload.conversationId));
            }

            createAck(ack)({ ok: true });
        });

        socket.on('chat:message:send', async (payload = {}, ack) => {
            try {
                const message = await ChatService.sendMessage(
                    payload.conversationId,
                    userId,
                    payload,
                );

                createAck(ack)({ ok: true, data: message });
            } catch (error) {
                respondSocketError(socket, ack, error);
            }
        });
    });

    ChatEventPublisher.setTransport(io);
    return io;
};
