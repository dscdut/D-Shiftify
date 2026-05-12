import crypto from 'crypto';
import { JwtPayload } from 'core/modules/auth/dto/jwt-sign.dto';
import connection, { getTransaction } from 'core/database';
import { BcryptService } from './bcrypt.service';
import { JwtService } from './jwt.service';
import { UserRepository } from '../../user/user.repository';
import { RefreshTokenRepository } from '../repository/refresh-token.repository';
import { PasswordResetTokenRepository } from '../repository/password-reset-token.repository';
import { EXPIRE_DAYS } from '../../../env';
import {
    UnAuthorizedException,
    DuplicateException,
    BadRequestException,
} from '../../../../packages/httpException';

// 30 ngay * 24 gio * 60 phut * 60 giay * 1000ms
const REFRESH_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000;

function parseTtlToSeconds(ttl) {
    if (!ttl) return 86400; // Mac dinh 1 ngay (86400 giay)
    const match = ttl.match(/^(\d+)([smhd])$/);
    if (!match) return 86400; // Mac dinh 1 ngay neu format sai
    const [, num, unit] = match;
    const multipliers = {
        s: 1,      // giay
        m: 60,     // phut
        h: 3600,   // gio
        d: 86400   // ngay (24 * 3600)
    };
    return parseInt(num, 10) * (multipliers[unit] || 86400);
}

class Service {
    constructor() {
        this.userRepository = UserRepository;
        this.refreshTokenRepository = RefreshTokenRepository;
        this.passwordResetTokenRepository = PasswordResetTokenRepository;
        this.jwtService = JwtService;
        this.bcryptService = BcryptService;
    }

    async login(loginDto) {
        const user = await this.userRepository.findByEmail(loginDto.email);

        if (!user) {
            throw new UnAuthorizedException('Email or password is incorrect');
        }

        if (!this.bcryptService.compare(loginDto.password, user.password_hash)) {
            throw new UnAuthorizedException('Email or password is incorrect');
        }

        const { id: ref, token: refreshToken } = await this.#createRefreshToken(user.id);
        const accessToken = this.jwtService.sign(JwtPayload({ id: user.id, roles: [user.role] }, ref));

        return {
            access_token: accessToken,
            refresh_token: refreshToken,
            expires_in: parseTtlToSeconds(EXPIRE_DAYS),
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                full_name: user.fullName || null,
            },
        };
    }

    async register(registerDto) {
        const existingByEmail = await this.userRepository.findByEmailExists(registerDto.email);
        if (existingByEmail) {
            throw new DuplicateException('Email already in use');
        }

        const existingByPhone = await connection('profiles')
            .whereNull('deleted_at')
            .where('phone', registerDto.phone)
            .select('id')
            .first();
        if (existingByPhone) {
            throw new DuplicateException('Phone number already in use');
        }

        const roleRow = await connection('roles').where('name', registerDto.role).first();
        if (!roleRow) {
            throw new BadRequestException(`Invalid role: ${registerDto.role}`);
        }

        const passwordHash = this.bcryptService.hash(registerDto.password);

        const trx = await getTransaction();
        let userId;
        try {
            const [insertedUser] = await this.userRepository.insert(
                {
                    email: registerDto.email,
                    password_hash: passwordHash,
                    role_id: roleRow.id,
                },
                trx,
                ['id'],
            );
            userId = insertedUser.id || insertedUser;

            await connection('profiles').insert({
                user_id: userId,
                full_name: registerDto.full_name,
                phone: registerDto.phone,
            }).transacting(trx);

            await trx.commit();
        } catch (error) {
            await trx.rollback();
            throw error;
        }

        const { id: ref, token: accessTokenString } = await this.#createRefreshToken(userId);
        const accessToken = this.jwtService.sign(JwtPayload({ id: userId, roles: [registerDto.role] }, ref));

        return {
            user_id: userId,
            email: registerDto.email,
            role: registerDto.role,
            access_token: accessToken,
            refresh_token: accessTokenString,
        };
    }

    async refresh(refreshDto) {
        const tokenRecord = await this.refreshTokenRepository.findValidToken(refreshDto.refresh_token);
        if (!tokenRecord) {
            throw new UnAuthorizedException('Refresh token is invalid or expired');
        }

        const user = await this.userRepository.findById(tokenRecord.user_id);
        if (!user) {
            throw new UnAuthorizedException('User not found');
        }

        await this.refreshTokenRepository.revokeToken(tokenRecord.id);

        const { id: ref, token: newRefreshToken } = await this.#createRefreshToken(user.id);
        const accessToken = this.jwtService.sign(JwtPayload({ id: user.id, roles: [user.role] }, ref));

        return {
            access_token: accessToken,
            refresh_token: newRefreshToken,
        };
    }

    async forgotPassword(forgotPasswordDto) {
        const user = await this.userRepository.findByEmailExists(forgotPasswordDto.email);

        if (!user) {
            return {
                message: 'Neu email ton tai trong he thong, ma OTP se duoc gui den email cua ban.',
            };
        }

        // Tao ma OTP ngau nhien co 6 chu so (tu 100000 den 999999)
        const otp = crypto.randomInt(100000, 999999).toString();
        // Thoi gian het han OTP: 15 phut * 60 giay * 1000ms
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

        await this.passwordResetTokenRepository.createToken(user.id, otp, expiresAt);

        // TODO: Send OTP via email when email service is integrated
        return {
            message: 'Neu email ton tai trong he thong, ma OTP se duoc gui den email cua ban.',
        };
    }

    async resetPassword(resetPasswordDto) {
        const tokenRecord = await this.passwordResetTokenRepository.findValidToken(resetPasswordDto.otp);
        if (!tokenRecord) {
            throw new BadRequestException('Ma OTP khong hop le hoac da het han.');
        }

        const newPasswordHash = this.bcryptService.hash(resetPasswordDto.new_password);

        const trx = await getTransaction();
        try {
            await this.userRepository.update(tokenRecord.user_id, { password_hash: newPasswordHash }, trx);
            await this.passwordResetTokenRepository.markUsed(tokenRecord.id, trx);
            await this.refreshTokenRepository.revokeAllForUser(tokenRecord.user_id, trx);
            await trx.commit();
        } catch (error) {
            await trx.rollback();
            throw error;
        }

        return {
            message: 'Mat khau da duoc thay doi thanh cong. Ban co the dang nhap ngay bay gio.',
        };
    }

    // ============================
    // API 6: LOGOUT
    // ============================
    // Luong xu ly:
    //   1. Tim refresh token trong DB
    //   2. Neu tim thay, revoke token do
    //   3. Tra ve thong bao thanh cong (luon tra ve 200 ke ca khong tim thay de bao mat)
    async logout(logoutDto) {
        const tokenRecord = await this.refreshTokenRepository.findValidToken(logoutDto.refresh_token);

        if (tokenRecord) {
            await this.refreshTokenRepository.revokeToken(tokenRecord.id);
        }

        return {
            message: 'Dang xuat thanh cong.',
        };
    }

    async #createRefreshToken(userId) {
        // Tao chuoi ngau nhien 32 bytes (64 ky tu hex) cho Refresh Token
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);
        const [record] = await this.refreshTokenRepository.createToken(userId, token, expiresAt);
        return {
            id: record.id || record,
            token: record.token || token
        };
    }
}

export const AuthService = new Service();
