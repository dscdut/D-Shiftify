import connection from 'core/database';
import { JwtService } from 'core/utils';
import { UnAuthorizedException } from '../../../httpException';
import { AUTH_CONTEXT } from '../../common/enum/authContext';

export class JwtValidator {
    #accessToken;

    #payload;

    static builder() {
        return new JwtValidator();
    }

    applyToken(accessToken) {
        if (accessToken) {
            this.#accessToken = accessToken.startsWith(AUTH_CONTEXT.PREFIX_HEADER)
                ? accessToken.slice(7)
                : accessToken;
        }
        return this;
    }

    async validate() {
        if (this.#accessToken) {
            try {
                this.#payload = JwtService.verify(this.#accessToken);
            } catch (e) {
                throw new UnAuthorizedException();
            }

            if (this.#payload && this.#payload.ref) {
                const tokenRecord = await connection('refresh_tokens')
                    .where('id', this.#payload.ref)
                    .where('revoked', false)
                    .first();

                if (!tokenRecord) {
                    throw new UnAuthorizedException();
                }
            }
        }
        return this;
    }

    getPayload() {
        return this.#payload;
    }
}
