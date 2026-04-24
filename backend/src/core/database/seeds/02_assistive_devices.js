const ASSISTIVE_DEVICES = [
    { name: 'Wheelchair' },
    { name: 'Screen Reader' },
    { name: 'Hearing Aid' },
    { name: 'Prosthetic Limb' },
    { name: 'Crutches' },
];

class AssistiveDevicesSeeder {
    constructor(knex) {
        this.knex = knex;
    }

    buildDevices() {
        return ASSISTIVE_DEVICES.map(device => ({
            id: this.knex.raw('gen_random_uuid()'),
            name: device.name,
            created_at: this.knex.fn.now(),
            updated_at: this.knex.fn.now(),
        }));
    }

    async seed() {
        await this.knex('assistive_devices').del();
        await this.knex('assistive_devices').insert(this.buildDevices());
    }
}

export async function seed(knex) {
    return new AssistiveDevicesSeeder(knex).seed();
}
