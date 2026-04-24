class CreateUserDevicesTable {
    constructor(knex) {
        this.knex = knex;
    }

    async up() {
        return this.knex.schema.createTable('user_devices', table => {
            table
                .uuid('id')
                .primary()
                .defaultTo(this.knex.raw('gen_random_uuid()'));
            table
                .uuid('profile_id')
                .notNullable()
                .references('id')
                .onDelete('CASCADE')
                .inTable('profiles');
            table
                .uuid('device_id')
                .notNullable()
                .references('id')
                .inTable('assistive_devices');
            table.timestamps(true, true);
            table.unique(['profile_id', 'device_id']);
        });
    }

    async down() {
        return this.knex.schema.dropTableIfExists('user_devices');
    }
}

export async function up (knex) {
    return new CreateUserDevicesTable(knex).up();
}

export async function down (knex) {
    return new CreateUserDevicesTable(knex).down();
}
