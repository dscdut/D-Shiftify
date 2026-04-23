class CreateRolesTable {
    constructor(knex) {
        this.knex = knex;
    }

    async up() {
        return this.knex.schema.createTable('roles', table => {
            table
                .uuid('id')
                .primary()
                .defaultTo(this.knex.raw('gen_random_uuid()'));
            table.string('name').notNullable().unique();
            table.text('description');
            table.timestamps(true, true);
        });
    }

    async down() {
        return this.knex.schema.dropTableIfExists('roles');
    }
}

export async function up(knex) {
    return new CreateRolesTable(knex).up();
}

export async function down(knex) {
    return new CreateRolesTable(knex).down();
}
