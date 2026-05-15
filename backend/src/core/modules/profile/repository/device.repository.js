import { DataRepository } from 'packages/restBuilder/core/dataHandler/data.repository';
import connection from 'core/database';

class Repository extends DataRepository {
    findAll() {
        return this.query().select('id', 'name');
    }

    findByProfileId(profileId) {
        return connection('user_devices')
            .innerJoin('assistive_devices', 'assistive_devices.id', 'user_devices.device_id')
            .where('user_devices.profile_id', profileId)
            .select(
                { id: 'assistive_devices.id' },
                { name: 'assistive_devices.name' },
            );
    }

    addDevicesToProfile(profileId, deviceIds, trx = null) {
        const rows = deviceIds.map(deviceId => ({
            profile_id: profileId,
            device_id: deviceId,
        }));
        const queryBuilder = connection('user_devices').insert(rows);
        if (trx) queryBuilder.transacting(trx);
        return queryBuilder;
    }

    removeAllDevicesFromProfile(profileId, trx = null) {
        const queryBuilder = connection('user_devices')
            .where('profile_id', profileId)
            .delete();
        if (trx) queryBuilder.transacting(trx);
        return queryBuilder;
    }

    findByIds(ids) {
        return this.query()
            .whereIn('id', ids)
            .select('id');
    }
}

export const DeviceRepository = new Repository('assistive_devices');
