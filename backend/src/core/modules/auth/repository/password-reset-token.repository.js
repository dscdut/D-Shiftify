import { DataRepository } from 'packages/restBuilder/core/dataHandler/data.repository';

class Repository extends DataRepository {
    createToken(userId, token, expiresAt) {
        return this.insert({
            user_id: userId,
            token,
            expires_at: expiresAt,
        });
    }

    findValidToken(token) {
        return this.query()
            .where('token', token)
            .where('used', false)
            .where('expires_at', '>', new Date())
            .first();
    }

    markUsed(id, trx = null) {
        const queryBuilder = this.query().where({ id }).update({ used: true });
        if (trx) queryBuilder.transacting(trx);
        return queryBuilder;
    }
}

export const PasswordResetTokenRepository = new Repository('password_reset_tokens');
