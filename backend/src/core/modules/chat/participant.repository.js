import { DataRepository } from 'packages/restBuilder/core/dataHandler/data.repository';

class Repository extends DataRepository {
    async insertMany(participants = [], trx = null) {
        if (!participants.length) {
            return [];
        }

        const queryBuilder = this.query().insert(
            participants,
            ['conversation_id', 'user_id'],
        );

        if (trx) {
            queryBuilder.transacting(trx);
        }

        return queryBuilder;
    }

    async findConversationIdsByUser(userId) {
        const rows = await this.query()
            .where('participants.user_id', userId)
            .select({ conversationId: 'participants.conversation_id' });

        return rows.map(row => row.conversationId);
    }

    findByConversationId(conversationId) {
        return this.findByConversationIds([conversationId]);
    }

    findByConversationIds(conversationIds = []) {
        if (!conversationIds.length) {
            return [];
        }

        return this.query()
            .innerJoin('users', 'users.id', 'participants.user_id')
            .leftJoin('roles', 'roles.id', 'users.role_id')
            .leftJoin('profiles', 'profiles.user_id', 'users.id')
            .whereIn('participants.conversation_id', conversationIds)
            .whereNull('users.deleted_at')
            .select(
                { conversationId: 'participants.conversation_id' },
                { userId: 'participants.user_id' },
                'users.email',
                { role: 'roles.name' },
                { fullName: 'profiles.full_name' },
                { createdAt: 'participants.created_at' },
                { updatedAt: 'participants.updated_at' },
            );
    }

    async isParticipant(conversationId, userId) {
        const participant = await this.query()
            .where({
                conversation_id: conversationId,
                user_id: userId,
            })
            .first('conversation_id');

        return Boolean(participant);
    }
}

export const ParticipantRepository = new Repository('participants');
