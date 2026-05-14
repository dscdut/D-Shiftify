import { DataRepository } from 'packages/restBuilder/core/dataHandler/data.repository';

class Repository extends DataRepository {
    findByIds(ids = []) {
        if (!ids.length) {
            return [];
        }

        return this.query()
            .leftJoin('roles', 'roles.id', 'users.role_id')
            .leftJoin('profiles', 'profiles.user_id', 'users.id')
            .whereIn('users.id', ids)
            .whereNull('users.deleted_at')
            .select(
                'users.id',
                'users.email',
                { role: 'roles.name' },
                { fullName: 'profiles.full_name' },
                { createdAt: 'users.created_at' },
                { updatedAt: 'users.updated_at' },
            );
    }
}

export const ChatUserRepository = new Repository('users');
