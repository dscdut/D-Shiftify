import { DataRepository } from 'packages/restBuilder/core/dataHandler/data.repository';

class Repository extends DataRepository {
    findByEmail(email) {
        return this.query()
            .innerJoin('roles', 'roles.id', 'users.role_id')
            .leftJoin('profiles', 'profiles.user_id', 'users.id')
            .whereNull('users.deleted_at')
            .where('users.email', '=', email)
            .select(
                'users.id',
                'users.email',
                'users.password_hash',
                { role: 'roles.name' },
                { fullName: 'profiles.full_name' },
                { createdAt: 'users.created_at' },
                { updatedAt: 'users.updated_at' },
                { deletedAt: 'users.deleted_at' },
            )
            .first();
    }

    findById(id) {
        return this.query()
            .innerJoin('roles', 'roles.id', 'users.role_id')
            .leftJoin('profiles', 'profiles.user_id', 'users.id')
            .whereNull('users.deleted_at')
            .where('users.id', '=', id)
            .select(
                'users.id',
                'users.email',
                { role: 'roles.name' },
                { fullName: 'profiles.full_name' },
                { createdAt: 'users.created_at' },
                { updatedAt: 'users.updated_at' },
                { deletedAt: 'users.deleted_at' },
            )
            .first();
    }

    findByEmailExists(email) {
        return this.query()
            .whereNull('deleted_at')
            .where('email', '=', email)
            .select('id')
            .first();
    }
}

export const UserRepository = new Repository('users');
