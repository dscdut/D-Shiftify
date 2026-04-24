class CreateVoiceLogsTable {
    constructor(knex) {
        this.knex = knex;
    }

    async up() {
        return this.knex.schema.createTable('voice_logs', table => {
            table
                .uuid('id')
                .primary()
                .defaultTo(this.knex.raw('gen_random_uuid()'));
            table
                .uuid('user_id')
                .notNullable()
                .references('id')
                .inTable('users');
            table.string('type').notNullable();
            table.string('source').notNullable();
            table.uuid('reference_id');
            table
                .enu('status', ['PENDING', 'ACCEPTED', 'REJECTED'])
                .notNullable()
                .defaultTo('PENDING');
            table.timestamps(true, true);
        });
    }

    async down() {
        return this.knex.schema.dropTableIfExists('voice_logs');
    }
}

export async function up(knex) {
    return new CreateVoiceLogsTable(knex).up();
}

export async function down(knex) {
    return new CreateVoiceLogsTable(knex).down();
}
