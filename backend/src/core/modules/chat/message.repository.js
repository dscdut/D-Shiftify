import { DataRepository } from 'packages/restBuilder/core/dataHandler/data.repository';

class Repository extends DataRepository {
    async createOne(message, trx = null) {
        const rows = await this.insert(
            message,
            trx,
            [
                'id',
                'conversation_id',
                'sender_id',
                'content',
                'voice_url',
                'type',
                'created_at',
                'updated_at',
                'deleted_at',
            ],
        );

        return rows[0];
    }

    findByConversationId(conversationId, { limit = 50, before = null } = {}) {
        let queryBuilder = this.#baseQuery()
            .where('messages.conversation_id', conversationId)
            .whereNull('messages.deleted_at');

        if (before) {
            queryBuilder = queryBuilder.where('messages.created_at', '<', before);
        }

        return queryBuilder
            .orderBy('messages.created_at', 'desc')
            .limit(limit);
    }

    findByConversationIds(conversationIds = []) {
        if (!conversationIds.length) {
            return [];
        }

        return this.#baseQuery()
            .whereIn('messages.conversation_id', conversationIds)
            .whereNull('messages.deleted_at')
            .orderBy('messages.created_at', 'desc');
    }

    findById(id) {
        return this.#baseQuery()
            .where('messages.id', id)
            .first();
    }

    #baseQuery() {
        return this.query()
            .innerJoin('users', 'users.id', 'messages.sender_id')
            .leftJoin('roles', 'roles.id', 'users.role_id')
            .leftJoin('profiles', 'profiles.user_id', 'users.id')
            .select(
                'messages.id',
                { conversationId: 'messages.conversation_id' },
                { senderId: 'messages.sender_id' },
                'messages.content',
                { voiceUrl: 'messages.voice_url' },
                'messages.type',
                { createdAt: 'messages.created_at' },
                { updatedAt: 'messages.updated_at' },
                { deletedAt: 'messages.deleted_at' },
                { senderEmail: 'users.email' },
                { senderRole: 'roles.name' },
                { senderFullName: 'profiles.full_name' },
            );
    }
}

export const MessageRepository = new Repository('messages');
