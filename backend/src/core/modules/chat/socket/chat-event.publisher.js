export const getConversationRoom = conversationId =>
    `conversation:${conversationId}`;

export const getUserRoom = userId => `user:${userId}`;

class Publisher {
    transport = null;

    setTransport(transport) {
        this.transport = transport;
    }

    clearTransport() {
        this.transport = null;
    }

    publishConversationCreated(conversation) {
        if (!this.transport) {
            return;
        }

        conversation.participants.forEach(participant => {
            this.transport
                .to(getUserRoom(participant.id))
                .emit('chat:conversation:new', conversation);
        });
    }

    publishMessage(message) {
        if (!this.transport) {
            return;
        }

        this.transport
            .to(getConversationRoom(message.conversationId))
            .emit('chat:message:new', message);
    }
}

export const ChatEventPublisher = new Publisher();
