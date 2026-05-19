import jwt from 'jsonwebtoken';
import { MESSAGE } from '../services/message.enum.js';
// Auth socket bằng JWT token.

export const socketAuthInterceptor =
    (socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            if (!token) {
                return next(
                    new Error(MESSAGE.TOKEN_REQUIRED)
                );
            }

            const decoded = jwt.verify( token, process.env.JWT_SECRET);
            socket.user = decoded;
            next();

        } catch (error) {
            next(new Error(MESSAGE.INVALID_TOKEN));
        }
    };