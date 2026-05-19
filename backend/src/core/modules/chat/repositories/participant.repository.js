import { DataRepository } from 'packages/restBuilder/core/dataHandler/data.repository';

class ParticipantRepository extends DataRepository {

    findParticipant(conversationId, userId) {
        return this.query().where(
            'participants.conversation_id',
            '=',
            conversationId
        ).where(
            'participants.user_id',
            '=',
            userId
        ).first();
    }

    findAllByConversationId(conversationId) {
        return this.query().innerJoin(
            'users',
            'users.id',
            'participants.user_id'
        ).where(
            'participants.conversation_id',
            '=',
            conversationId
        ).select(
            'participants.conversation_id as conversationId',
            'participants.user_id as userId',
            'users.email',
            'participants.created_at as createdAt',
            'participants.updated_at as updatedAt',
        );
    }

    create(participantData, trx = null) {

        const queryBuilder = this.query();

        if (trx) {
            queryBuilder.transacting(trx);
        }

        return queryBuilder
            .insert(participantData)
            .returning([
                'conversation_id as conversationId',
                'user_id as userId',
                'created_at as createdAt',
                'updated_at as updatedAt',
            ])
            .then(rows => rows[0]);
    }
}

export const ParticipantsRepository = new ParticipantRepository('participants');