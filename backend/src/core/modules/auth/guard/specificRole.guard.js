import { getUserContext } from 'packages/authModel/module/user';

export class SpecificRoleGuard {
    #role;

    constructor(role) {
        this.#role = role;
    }

    canActive(req) {
        const user = getUserContext(req);
        if (!user || !user.roles) return false;
        const targetRole = typeof this.#role === 'object' && this.#role.name ? this.#role.name : this.#role;
        return user.roles.some(role => typeof role === 'string' && role.toLowerCase() === targetRole.toLowerCase());
    }
}
