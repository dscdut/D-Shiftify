import { getUserContext } from 'packages/authModel/module/user';

export class UnionRoleGuard {
    #unionRoles;

    constructor(...roles) {
        this.#unionRoles = roles;
    }

    canActive(req) {
        const user = getUserContext(req);
        if (!user || !user.roles) return false;
        return user.roles.some(userRole =>
            typeof userRole === 'string' &&
            this.#unionRoles.some(roleMayRequired =>
                typeof roleMayRequired === 'string' &&
                roleMayRequired.toLowerCase() === userRole.toLowerCase()
            )
        );
    }
}
