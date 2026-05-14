import { DataRepository } from 'packages/restBuilder/core/dataHandler/data.repository';

class Repository extends DataRepository {
    findById(id) {
        return this.query()
            .where('conversations.id', id)
            .first(
                'conversations.id',
                { createdAt: 'conversations.created_at' },
                { updatedAt: 'conversations.updated_at' },
            );
    }

    findByIds(ids = []) {
        if (!ids.length) {
            return [];
        }

        return this.query()
            .whereIn('conversations.id', ids)
            .select(
                'conversations.id',
                { createdAt: 'conversations.created_at' },
                { updatedAt: 'conversations.updated_at' },
            );
    }

    async createOne(trx = null) {
        const data = await this.insert(
            {},
            trx,
            ['id', 'created_at', 'updated_at'],
        );

        return {
            id: data[0].id,
            createdAt: data[0].created_at,
            updatedAt: data[0].updated_at,
        };
    }
}

export const ConversationRepository = new Repository('conversations');
