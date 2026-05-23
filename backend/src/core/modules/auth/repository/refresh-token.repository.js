import { DataRepository } from 'packages/restBuilder/core/dataHandler/data.repository';

class Repository extends DataRepository {
    createToken(userId, token, expiresAt, trx = null) {
        return this.insert(
            {
                user_id: userId,
                token,
                expires_at: expiresAt,
            },
            trx,
            ['id', 'token'],
        );
    }

    findValidToken(token) {
        return this.query()
            .where('token', token)
            .where('revoked', false)
            .where('expires_at', '>', new Date())
            .first();
    }

    revokeToken(id, trx = null) {
        const queryBuilder = this.query().where({ id }).update({ revoked: true });
        if (trx) queryBuilder.transacting(trx);
        return queryBuilder;
    }

    revokeAllForUser(userId, trx = null) {
        const queryBuilder = this.query()
            .where('user_id', userId)
            .where('revoked', false)
            .update({ revoked: true });
        if (trx) queryBuilder.transacting(trx);
        return queryBuilder;
    }
}

export const RefreshTokenRepository = new Repository('refresh_tokens');
