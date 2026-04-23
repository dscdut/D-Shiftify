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
                .references('id')
                .inTable('users');
            table.string('type');
            table.string('source');
            table.uuid('reference_id');
            table.string('status');
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
