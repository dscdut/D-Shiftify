import { DataRepository } from 'packages/restBuilder/core/dataHandler/data.repository';

class MessageRepository extends DataRepository {
    
    create(messageData, trx = null) {
        const queryBuilder = this.query()
            .insert(messageData).returning([
             'id',
            'conversation_id as conversationId',
            'sender_id as senderId',
            'content',
            'voice_url as voiceUrl',
            'created_at as createdAt',
            'updated_at as updatedAt',
            ]);

        if (trx) {
            queryBuilder.transacting(trx);
        }
        return queryBuilder.then(rows => rows[0]);
    }

    findById(id) {
        return this.query().where('messages.id', '=', id).whereNull('messages.deleted_at').select(
            'messages.id',
            'messages.conversation_id as conversationId',
            'messages.sender_id as senderId',
            'messages.content',
            'messages.voice_url as voiceUrl',
            'messages.created_at as createdAt',
            'messages.updated_at as updatedAt',
        ).first();
    }

    findAllByConversationId(conversationId) {
        return this.query().where(
            'messages.conversation_id',
            '=',
            conversationId
        ).whereNull('messages.deleted_at').select(
            'messages.id',
            'messages.conversation_id as conversationId',
            'messages.sender_id as senderId',
            'messages.content',
            'messages.voice_url as voiceUrl',
            'messages.created_at as createdAt',
            'messages.updated_at as updatedAt',
        ).orderBy(
            'messages.created_at',
            'asc'
        );
    }

    update(id, messageData) {
        return this.query().where('id', id).update({
            ...messageData,
            updated_at: new Date(),
        }).returning([
            'id',
            'conversation_id as conversationId',
            'sender_id as senderId',
            'content',
            'voice_url as voiceUrl',
            'created_at as createdAt',
            'updated_at as updatedAt',
        ]).then((rows) => rows[0]);
    }
}

export const MessagesRepository = new MessageRepository('messages');