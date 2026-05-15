import { DataRepository } from 'packages/restBuilder/core/dataHandler/data.repository';

class Repository extends DataRepository {
    findByUserId(userId) {
        return this.query()
            .whereNull('deleted_at')
            .where('user_id', userId)
            .select(
                'id',
                'user_id',
                'full_name',
                'dob',
                'gender',
                'phone',
                'disability_status',
                'created_at',
                'updated_at',
            )
            .first();
    }

    updateByUserId(userId, data, trx = null) {
        const queryBuilder = this.query()
            .whereNull('deleted_at')
            .where('user_id', userId)
            .update(data);
        if (trx) queryBuilder.transacting(trx);
        return queryBuilder;
    }
}

export const ProfileRepository = new Repository('profiles');
