import { DataRepository }
    from 'packages/restBuilder/core/dataHandler/data.repository';

class Repository extends DataRepository {

    createUserDevices(profile_id, device_ids = [], trx = null) {
        if (!device_ids.length) {
            return Promise.resolve([]);
        }
        const rows = device_ids.map(device_id => ({profile_id,device_id,}));
        const queryBuilder = this.query().insert(rows);
        if (trx) {
            queryBuilder.transacting(trx);
        }
        return queryBuilder;
    }

    deleteByProfileId(profile_id, trx = null) {

        const queryBuilder = this.query()
            .where('profile_id', profile_id)
            .delete();

        if (trx) {
            queryBuilder.transacting(trx);
        }

        return queryBuilder;
    }
}

export const UserDeviceRepository = new Repository('user_devices');