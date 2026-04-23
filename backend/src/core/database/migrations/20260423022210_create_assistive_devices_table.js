class CreateAssistiveDevicesTable {
    constructor(knex) {
        this.knex = knex;
    }

    async up() {
        return this.knex.schema.createTable('assistive_devices', table => {
            table
                .uuid('id')
                .primary()
                .defaultTo(this.knex.raw('gen_random_uuid()'));
            table.string('name');
            table.timestamps(true, true);
        });
    }

    async down() {
        return this.knex.schema.dropTableIfExists('assistive_devices');
    }
}

export async function up (knex) {
    return new CreateAssistiveDevicesTable(knex).up();
}

export async function down (knex) {
    return new CreateAssistiveDevicesTable(knex).down();
}
