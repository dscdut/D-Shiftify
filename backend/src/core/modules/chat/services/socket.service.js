import { SOCKET_EVENTS } from '../socket/socket.events';
import { MessageService } from './message.service';

class Service {

    constructor() {
        this.messageService = MessageService;
    }

    async sendMessage(io, socket, payload) {

        // create db message
        const message = await this.messageService.createMessage(
            payload,
            socket.user.id
        );

        //emit realtime 
        io.to(payload.conversationId).emit(
            SOCKET_EVENTS.RECEIVE_MESSAGE,
            message
        );

        return message;
    }
}

export const SocketService = new Service();