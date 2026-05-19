import { DataRepository } from 'packages/restBuilder/core/dataHandler/data.repository';

class ConversationRepository extends DataRepository {
    create(conversationData, trx = null) {

        const queryBuilder = this.query()
            .insert(conversationData)
            .returning([
                'id',
                'created_at as createdAt',
                'updated_at as updatedAt',
            ]);

        if (trx) {
            queryBuilder.transacting(trx);
        }

        return queryBuilder.then(rows => rows[0]);
    }

    findById(id) {
        return this.query().where('conversations.id', '=', id).select(
            'conversations.id',
            'conversations.created_at as createdAt',
            'conversations.updated_at as updatedAt',
        ).first();
    }

    findAllByUserId(userId) {
        return this.query().join(
            'participants',
            'participants.conversation_id',
            'conversations.id'
        ).where('participants.user_id', '=', userId).select(
            'conversations.id',
            'conversations.created_at as createdAt',
            'conversations.updated_at as updatedAt',
        ).orderBy('conversations.updated_at', 'desc');
    }

    update(id, conversationData) {
        return this.query().where('id', id).update({
            ...conversationData,
            updated_at: new Date(),
        }).returning([
            'id',
            'created_at as createdAt',
            'updated_at as updatedAt',
        ]).then((rows) => rows[0]);
    }
}

export const ConversationsRepository = new ConversationRepository('conversations');