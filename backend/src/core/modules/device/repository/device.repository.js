import { DataRepository } from 'packages/restBuilder/core/dataHandler/data.repository';
import connection from 'core/database';

class Repository extends DataRepository {
    findAll() {
        return this.query().select('id', 'name').orderBy('name', 'asc');
    }

    findByProfileId(profileId) {
        return connection('user_devices')
            .innerJoin('assistive_devices', 'assistive_devices.id', 'user_devices.device_id')
            .where('user_devices.profile_id', profileId)
            .whereNull('user_devices.deleted_at')
            .select(
                { id: 'assistive_devices.id' },
                { name: 'assistive_devices.name' },
            );
    }

    addDevicesToProfile(profileId, deviceIds, trx = null) {
        const rows = deviceIds.map(deviceId => ({
            profile_id: profileId,
            device_id: deviceId,
            deleted_at: null,
        }));
        const queryBuilder = connection('user_devices')
            .insert(rows)
            .onConflict(['profile_id', 'device_id'])
            .merge({
                deleted_at: null,
                updated_at: connection.fn.now(),
            });
        if (trx) queryBuilder.transacting(trx);
        return queryBuilder;
    }

    removeAllDevicesFromProfile(profileId, trx = null) {
        const queryBuilder = connection('user_devices')
            .where('profile_id', profileId)
            .whereNull('deleted_at')
            .update({
                deleted_at: connection.fn.now(),
                updated_at: connection.fn.now(),
            });
        if (trx) queryBuilder.transacting(trx);
        return queryBuilder;
    }

    findByIds(ids) {
        if (ids.length === 0) return [];
        return this.query()
            .whereIn('id', ids)
            .select('id');
    }
}

export const DeviceRepository = new Repository('assistive_devices');
