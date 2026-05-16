import { DataRepository } from 'packages/restBuilder/core/dataHandler/data.repository';

class Repository extends DataRepository {
    createToken(userId, token, expiresAt) {
        return this.insert({
            user_id: userId,
            token,
            expires_at: expiresAt,
        });
    }

    findValidToken(token, email) {
        return this.query()
            .join('users', 'users.id', 'password_reset_tokens.user_id')
            .where('password_reset_tokens.token', token)
            .where('users.email', email)
            .where('password_reset_tokens.used', false)
            .where('password_reset_tokens.expires_at', '>', new Date())
            .select('password_reset_tokens.*')
            .first();
    }

    markUsed(id, trx = null) {
        const queryBuilder = this.query().where({ id }).update({ used: true });
        if (trx) queryBuilder.transacting(trx);
        return queryBuilder;
    }
}

export const PasswordResetTokenRepository = new Repository('password_reset_tokens');
