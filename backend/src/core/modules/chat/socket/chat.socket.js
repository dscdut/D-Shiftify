import { Server } from 'socket.io';
import { SOCKET_EVENTS } from './socket.events';
import { socketAuthInterceptor, JoinConversationInterceptor,JoinConversationSchema ,  CreateMessageInterceptor , CreateMessageSchema } from '../interceptor';
import { ParticipantsRepository } from '../repositories/participant.repository';
import { SocketService } from '../services/socket.service';
import { MESSAGE } from '../services/message.enum.js';

let io = null;

export const initializeChatGateway  = httpServer => {

    io = new Server(httpServer, { cors: { origin: '*' } });

    //auth socket 
    io.use(socketAuthInterceptor);

    io.on(SOCKET_EVENTS.CONNECTION, socket => {

        socket.on(SOCKET_EVENTS.JOIN_CONVERSATION, async payload => {
            try {
                const { error } = JoinConversationSchema.validate(payload);

                if (error) {
                    return socket.emit(SOCKET_EVENTS.ERROR, {
                        message: error.message,
                    });
                }
                const participant = await ParticipantsRepository.findParticipant(
                    payload.conversationId,
                    socket.user.id
                );

                if (!participant) {
                    return socket.emit(SOCKET_EVENTS.ERROR, {
                        message: MESSAGE.FORBIDDEN,
                    });
                }

                socket.join(payload.conversationId);

                socket.emit(SOCKET_EVENTS.JOIN_CONVERSATION_SUCCESS, {
                    conversationId: payload.conversationId,
                });
                
            } catch (error) {
                socket.emit(SOCKET_EVENTS.ERROR, {
                    message: error.message,
                });
            }
        });

        socket.on(SOCKET_EVENTS.SEND_MESSAGE, async payload => {
            try {
                const { error } = CreateMessageSchema.validate(payload);

                if (error) {
                    return socket.emit(SOCKET_EVENTS.ERROR, {
                        message: error.message,
                    });
                }
                await SocketService.sendMessage(io, socket, payload);
            } catch (error) {
                socket.emit(SOCKET_EVENTS.ERROR, {
                    message: error.message,
                });
            }
        });
    });

    return io;
};

export const getIO = () => {

    if (!io) {
        throw new Error(MESSAGE.SOCKET_NOT_INITIALIZED);
    }

    return io;
};