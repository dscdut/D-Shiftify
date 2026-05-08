# Huong Dan Chi Tiet Tao API Auth (Authentication Module)

Dua vao kien truc **Resolver -> Controller -> Service -> Repository** cua du an, tai lieu nay huong dan tung buoc xay dung 5 API Authentication:

| # | Method | Endpoint | Mo ta |
|---|--------|----------|-------|
| 1 | POST | `/api/auth/v1/login` | Dang nhap, tra ve access token va refresh token |
| 2 | POST | `/api/auth/v1/register` | Dang ky tai khoan moi (user + profile) |
| 3 | POST | `/api/auth/v1/refresh` | Lam moi token bang refresh token |
| 4 | POST | `/api/auth/v1/forgot-password` | Yeu cau reset mat khau (tao ma OTP 6 so) |
| 5 | POST | `/api/auth/v1/reset-password` | Dat lai mat khau bang ma OTP |

## Tong Quan Kien Truc

API Auth duoc chia thanh 2 thu muc chinh:
1. **Phan xu ly Logic va Du lieu (Module Core):** `src/core/modules/auth/`
2. **Phan Dinh tuyen va Nhan Request (API Route):** `src/core/api/auth/`

### So do file can tao/sua

```
src/
├── core/
│   ├── api/
│   │   └── auth/
│   │       ├── auth.controller.js            # (SUA) Controller xu ly request/response — 5 handler
│   │       └── auth.resolver.js              # (SUA) Dinh tuyen 5 route
│   ├── database/
│   │   └── migrations/
│   │       └── 20260424130019_create_password_reset_tokens.js  # (MOI) Migration
│   └── modules/
│       ├── auth/
│       │   ├── dto/
│       │   │   ├── login.dto.js              # (GIU NGUYEN) DTO cho login
│       │   │   ├── jwt-sign.dto.js           # (GIU NGUYEN) DTO cho JWT payload
│       │   │   ├── register.dto.js           # (MOI) DTO cho register
│       │   │   ├── refresh.dto.js            # (MOI) DTO cho refresh
│       │   │   ├── forgot-password.dto.js    # (MOI) DTO cho forgot-password
│       │   │   ├── reset-password.dto.js     # (MOI) DTO cho reset-password
│       │   │   └── index.js                  # (SUA) Them export cac DTO moi
│       │   ├── interceptor/
│       │   │   ├── login.interceptor.js      # (GIU NGUYEN) Validate login input
│       │   │   ├── register.interceptor.js   # (MOI) Validate register input
│       │   │   ├── refresh.interceptor.js    # (MOI) Validate refresh input
│       │   │   ├── forgot-password.interceptor.js  # (MOI) Validate forgot-password input
│       │   │   ├── reset-password.interceptor.js   # (MOI) Validate reset-password input
│       │   │   └── index.js                  # (SUA) Them export 4 interceptor moi
│       │   ├── repository/
│       │   │   ├── refresh-token.repository.js       # (MOI) CRUD refresh_tokens
│       │   │   ├── password-reset-token.repository.js # (MOI) CRUD password_reset_tokens
│       │   │   └── index.js                  # (MOI) Barrel export
│       │   ├── service/
│       │   │   ├── auth.service.js           # (SUA) Viet lai — 5 method
│       │   │   ├── jwt.service.js            # (GIU NGUYEN) Sign/verify JWT
│       │   │   ├── bcrypt.service.js         # (GIU NGUYEN) Hash/compare password
│       │   │   └── index.js                  # (GIU NGUYEN)
│       │   ├── guard/                        # (GIU NGUYEN) Role-based guards
│       │   └── index.js                      # (SUA) Them export repository
│       └── user/
│           └── user.repository.js            # (SUA) Fix query cho dung schema DB
```

---

## Buoc 0: Database — Cac bang lien quan

### Bang `users` (da co san — migration `20260424130003`)

```
users
├── id (UUID, PK, auto uuid_generate_v4())
├── email (string, UNIQUE, NOT NULL, indexed)
├── password_hash (string, NOT NULL)           ← CHU Y: ten cot la password_hash, KHONG phai password
├── role_id (UUID, FK -> roles.id, NOT NULL, indexed)
├── created_at, updated_at
└── deleted_at (soft delete)
```

### Bang `roles` (da co san — migration `20260424130002`)

```
roles
├── id (UUID, PK)
├── name (string, UNIQUE) — gia tri: 'candidate', 'recruiter', 'admin', 'training_center'
└── description (text, nullable)
```

### Bang `profiles` (da co san — migration `20260424130005`)

```
profiles
├── id (UUID, PK)
├── user_id (UUID, FK -> users.id, UNIQUE)
├── full_name (string, nullable)
├── phone (string, nullable)
├── dob, gender, disability_status
├── created_at, updated_at
└── deleted_at
```

### Bang `refresh_tokens` (da co san — migration `20260424130004`)

```
refresh_tokens
├── id (UUID, PK)
├── user_id (UUID, FK -> users.id, indexed)
├── token (string, UNIQUE, NOT NULL)
├── expires_at (timestamp, NOT NULL)
├── revoked (boolean, default false)
└── created_at, updated_at
```

### Bang `password_reset_tokens` (CAN TAO MOI — migration `20260424130019`)

```
password_reset_tokens
├── id (UUID, PK)
├── user_id (UUID, FK -> users.id, indexed)
├── token (string, UNIQUE, NOT NULL)
├── expires_at (timestamp, NOT NULL)
├── used (boolean, default false)
└── created_at, updated_at
```

**Luu y quan trong ve schema:**
- Cot mat khau trong bang `users` la `password_hash` (KHONG phai `password`)
- Moi user chi co 1 role, luu truc tiep qua `role_id` (KHONG dung bang trung gian `users_roles`)
- `full_name` va `phone` nam trong bang `profiles`, KHONG nam trong bang `users`

---

## Buoc 1: Tao Migration cho `password_reset_tokens`

**File:** `src/core/database/migrations/20260424130019_create_password_reset_tokens.js`

Bang nay luu token reset mat khau. Moi token chi dung 1 lan (`used`) va co thoi han (`expires_at`).

```js
const tableName = 'password_reset_tokens';

exports.up = async knex => {
    await knex.schema.createTable(tableName, table => {
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table
            .uuid('user_id')
            .notNullable()
            .references('id')
            .inTable('users')
            .onDelete('CASCADE');
        table.string('token').notNullable().unique();
        table.timestamp('expires_at').notNullable();
        table.boolean('used').defaultTo(false);
        table.timestamps(false, true);

        table.index('user_id');
    });

    await knex.raw(`
        CREATE TRIGGER update_timestamp
        BEFORE UPDATE ON ${tableName}
        FOR EACH ROW
        EXECUTE PROCEDURE update_timestamp();
    `);
};

exports.down = knex => knex.schema.dropTable(tableName);
```

**Giai thich:**
- Cau truc giong hoan toan `refresh_tokens` migration, chi thay `revoked` bang `used`.
- `table.timestamps(false, true)` tao `created_at` va `updated_at` voi default `CURRENT_TIMESTAMP`.
- Trigger `update_timestamp` tu dong cap nhat `updated_at` khi UPDATE (ham da tao san o migration `20260424130001`).
- `onDelete('CASCADE')` — khi xoa user thi cac token lien quan cung bi xoa.

**Chay migration:**
```bash
yarn knex migrate:latest
```

---

## Buoc 2: Sua User Repository (Fix cho dung schema)

**File:** `src/core/modules/user/user.repository.js`

Repository cu bi loi vi tham chieu bang `users_roles` (khong ton tai) va cot `users.password` (khong dung). Can viet lai de phu hop voi schema thuc te.

```js
import { DataRepository } from 'packages/restBuilder/core/dataHandler/data.repository';

class Repository extends DataRepository {
    // Tim user theo email — dung cho Login
    // JOIN: users -> roles (lay ten role), LEFT JOIN profiles (lay full_name)
    // Tra ve 1 object (khong phai array) nho .first()
    findByEmail(email) {
        return this.query()
            .innerJoin('roles', 'roles.id', 'users.role_id')
            .leftJoin('profiles', 'profiles.user_id', 'users.id')
            .whereNull('users.deleted_at')
            .where('users.email', '=', email)
            .select(
                'users.id',
                'users.email',
                'users.password_hash',
                { role: 'roles.name' },
                { fullName: 'profiles.full_name' },
                { createdAt: 'users.created_at' },
                { updatedAt: 'users.updated_at' },
                { deletedAt: 'users.deleted_at' },
            )
            .first();
    }

    // Tim user theo ID — dung cho Refresh token (lay thong tin moi nhat cua user)
    // Giong findByEmail nhung khong select password_hash
    findById(id) {
        return this.query()
            .innerJoin('roles', 'roles.id', 'users.role_id')
            .leftJoin('profiles', 'profiles.user_id', 'users.id')
            .whereNull('users.deleted_at')
            .where('users.id', '=', id)
            .select(
                'users.id',
                'users.email',
                { role: 'roles.name' },
                { fullName: 'profiles.full_name' },
                { createdAt: 'users.created_at' },
                { updatedAt: 'users.updated_at' },
                { deletedAt: 'users.deleted_at' },
            )
            .first();
    }

    // Kiem tra email da ton tai chua — dung cho Register va Forgot Password
    // Chi tra ve { id } hoac null, khong load toan bo du lieu
    findByEmailExists(email) {
        return this.query()
            .whereNull('deleted_at')
            .where('email', '=', email)
            .select('id')
            .first();
    }
}

export const UserRepository = new Repository('users');
```

**Giai thich cac thay doi so voi code cu:**
- **Cu:** `innerJoin('users_roles', ...)` → **Moi:** `innerJoin('roles', 'roles.id', 'users.role_id')` — vi schema moi dung `role_id` truc tiep tren `users`, khong co bang `users_roles`.
- **Cu:** `'users.password'` → **Moi:** `'users.password_hash'` — ten cot dung trong migration.
- **Cu:** `{ fullName: 'users.full_name' }` → **Moi:** `leftJoin('profiles', ...)` + `{ fullName: 'profiles.full_name' }` — `full_name` nam trong bang `profiles`.
- **Cu:** tra ve array → **Moi:** them `.first()` — moi email chi co 1 user, tra ve object truc tiep.
- **Moi:** them `findByEmailExists()` — query nhe chi tra ve `{ id }`, dung cho kiem tra trung email.
- **Xoa:** `findRoles()` — khong con can vi moi user chi co 1 role.

---

## Buoc 3: Tao Repository cho Refresh Token va Password Reset Token

### File: `src/core/modules/auth/repository/refresh-token.repository.js`

Repository ke thua `DataRepository` va trien khai 4 ham cho bang `refresh_tokens`:

```js
import { DataRepository } from 'packages/restBuilder/core/dataHandler/data.repository';

class Repository extends DataRepository {
    // Tao refresh token moi trong DB
    // Tra ve [{ id, token }] — dung .insert() cua DataRepository
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

    // Tim token hop le: chua bi revoke VA chua het han
    // Tra ve 1 object hoac null
    findValidToken(token) {
        return this.query()
            .where('token', token)
            .where('revoked', false)
            .where('expires_at', '>', new Date())
            .first();
    }

    // Thu hoi 1 token cu the (dung khi rotate token)
    revokeToken(id, trx = null) {
        const queryBuilder = this.query().where({ id }).update({ revoked: true });
        if (trx) queryBuilder.transacting(trx);
        return queryBuilder;
    }

    // Thu hoi TAT CA token cua 1 user (dung khi reset password — ep dang nhap lai tren moi thiet bi)
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
```

**Giai thich:**
- `insert(data, trx, columns)` la method cua `DataRepository`. Voi PostgreSQL, `columns = ['id', 'token']` se tra ve `[{ id: '...', token: '...' }]`.
- `findValidToken` kiem tra 3 dieu kien: token khop, chua revoke, chua het han.
- `revokeAllForUser` dung khi reset password — ep tat ca session dang nhap truoc do phai dang nhap lai.
- Cac method ghi du lieu ho tro `trx` (transaction) de dam bao tinh nhat quan.

### File: `src/core/modules/auth/repository/password-reset-token.repository.js`

```js
import { DataRepository } from 'packages/restBuilder/core/dataHandler/data.repository';

class Repository extends DataRepository {
    // Tao reset token moi
    createToken(userId, token, expiresAt) {
        return this.insert({
            user_id: userId,
            token,
            expires_at: expiresAt,
        });
    }

    // Tim token hop le: chua bi used VA chua het han
    findValidToken(token) {
        return this.query()
            .where('token', token)
            .where('used', false)
            .where('expires_at', '>', new Date())
            .first();
    }

    // Danh dau token da su dung (moi token chi dung 1 lan)
    markUsed(id, trx = null) {
        const queryBuilder = this.query().where({ id }).update({ used: true });
        if (trx) queryBuilder.transacting(trx);
        return queryBuilder;
    }
}

export const PasswordResetTokenRepository = new Repository('password_reset_tokens');
```

**Giai thich:**
- Tuong tu `RefreshTokenRepository` nhung dung cot `used` thay vi `revoked`.
- `markUsed` dam bao moi token chi dung duoc 1 lan.

### File: `src/core/modules/auth/repository/index.js`

```js
export { RefreshTokenRepository } from './refresh-token.repository';
export { PasswordResetTokenRepository } from './password-reset-token.repository';
```

---

## Buoc 4: Tao DTO cho Register, Refresh, Forgot Password, Reset Password

DTO (Data Transfer Object) map request body thanh object co cau truc chuan, dong thoi dang ky Swagger model. Moi API POST can co DTO tuong ung de Swagger hien thi request body.

### File: `src/core/modules/auth/dto/register.dto.js`

```js
import { ApiDocument } from 'core/config/swagger.config';
import { SwaggerDocument } from 'packages/swagger';

ApiDocument.addModel('RegisterDto',
    {
        email: SwaggerDocument.ApiProperty({ type: 'string' }),
        phone: SwaggerDocument.ApiProperty({ type: 'string' }),
        password: SwaggerDocument.ApiProperty({ type: 'string' }),
        role: SwaggerDocument.ApiProperty({ type: 'string' }),
        full_name: SwaggerDocument.ApiProperty({ type: 'string' }),
    });

export const RegisterDto = body => ({
    email: body.email,
    phone: body.phone,
    password: body.password,
    role: body.role,
    full_name: body.full_name,
});
```

### File: `src/core/modules/auth/dto/refresh.dto.js`

```js
import { ApiDocument } from 'core/config/swagger.config';
import { SwaggerDocument } from 'packages/swagger';

ApiDocument.addModel('RefreshDto',
    {
        refresh_token: SwaggerDocument.ApiProperty({ type: 'string' }),
    });

export const RefreshDto = body => ({
    refresh_token: body.refresh_token,
});
```

### File: `src/core/modules/auth/dto/forgot-password.dto.js`

```js
import { ApiDocument } from 'core/config/swagger.config';
import { SwaggerDocument } from 'packages/swagger';

ApiDocument.addModel('ForgotPasswordDto',
    {
        email: SwaggerDocument.ApiProperty({ type: 'string' }),
    });

export const ForgotPasswordDto = body => ({
    email: body.email,
});
```

### File: `src/core/modules/auth/dto/reset-password.dto.js`

```js
import { ApiDocument } from 'core/config/swagger.config';
import { SwaggerDocument } from 'packages/swagger';

ApiDocument.addModel('ResetPasswordDto',
    {
        otp: SwaggerDocument.ApiProperty({ type: 'string', example: '123456' }),
        new_password: SwaggerDocument.ApiProperty({ type: 'string' }),
    });

export const ResetPasswordDto = body => ({
    otp: body.otp,
    new_password: body.new_password,
});
```

**Giai thich:**
- `ApiDocument.addModel(...)` dang ky model cho Swagger docs tai `/api-docs`. Neu khong co, Swagger se khong hien thi request body va khong the "Try it out".
- Moi ham DTO chi extract cac field can thiet tu `req.body`, tranh truyen du lieu thua.
- Tham khao `login.dto.js` da co san de thay pattern tuong tu.

### Sua file: `src/core/modules/auth/dto/index.js` — them export

```js
export * from './login.dto';
export * from './jwt-sign.dto';
export * from './register.dto';
export * from './refresh.dto';              // <-- THEM
export * from './forgot-password.dto';      // <-- THEM
export * from './reset-password.dto';       // <-- THEM
```

---

## Buoc 5: Tao Interceptor (Validate input)

Moi API can 1 interceptor de validate request body truoc khi vao Controller. Tat ca deu dung `DefaultValidatorInterceptor` voi Joi schema.

### File: `src/core/modules/auth/interceptor/register.interceptor.js`

```js
import { DefaultValidatorInterceptor } from 'core/infrastructure/interceptor';
import { JoiUtils } from 'core/utils';
import Joi from 'joi';

export const RegisterInterceptor = new DefaultValidatorInterceptor(
    Joi.object({
        email: JoiUtils.email().required(),
        phone: Joi.string().pattern(/^[0-9]{10,11}$/).required().messages({
            'string.pattern.base': 'Phone must be 10-11 digits',
        }),
        password: Joi.string().min(8).required().messages({
            'string.min': 'Password must be at least 8 characters',
        }),
        role: Joi.string().valid('candidate', 'recruiter', 'training_center').required(),
        full_name: JoiUtils.requiredString(),
    })
);
```

**Giai thich:**
- `JoiUtils.email()` validate dinh dang email (co san trong `core/utils/joi.util.js`).
- `phone` phai la 10-11 chu so.
- `password` toi thieu 8 ky tu.
- `role` chi chap nhan 3 gia tri hop le: `candidate`, `recruiter`, `training_center`. Role `admin` chi duoc tao boi he thong, khong cho phep tu dang ky.
- `DefaultValidatorInterceptor` tu dong tra ve loi 400 neu validation that bai.

### File: `src/core/modules/auth/interceptor/refresh.interceptor.js`

```js
import { DefaultValidatorInterceptor } from 'core/infrastructure/interceptor';
import { JoiUtils } from 'core/utils';
import Joi from 'joi';

export const RefreshInterceptor = new DefaultValidatorInterceptor(
    Joi.object({
        refresh_token: JoiUtils.requiredString(),
    })
);
```

### File: `src/core/modules/auth/interceptor/forgot-password.interceptor.js`

```js
import { DefaultValidatorInterceptor } from 'core/infrastructure/interceptor';
import { JoiUtils } from 'core/utils';
import Joi from 'joi';

export const ForgotPasswordInterceptor = new DefaultValidatorInterceptor(
    Joi.object({
        email: JoiUtils.email().required(),
    })
);
```

### File: `src/core/modules/auth/interceptor/reset-password.interceptor.js`

```js
import { DefaultValidatorInterceptor } from 'core/infrastructure/interceptor';
import { JoiUtils } from 'core/utils';
import Joi from 'joi';

export const ResetPasswordInterceptor = new DefaultValidatorInterceptor(
    Joi.object({
        otp: Joi.string().length(6).pattern(/^[0-9]+$/).required().messages({
            'string.length': 'OTP must be exactly 6 digits',
            'string.pattern.base': 'OTP must contain only numbers',
        }),
        new_password: Joi.string().min(8).required().messages({
            'string.min': 'Password must be at least 8 characters',
        }),
    })
);
```

### Sua file: `src/core/modules/auth/interceptor/index.js` — them export

```js
export * from './login.interceptor';
export * from './register.interceptor';          // <-- THEM
export * from './refresh.interceptor';           // <-- THEM
export * from './forgot-password.interceptor';   // <-- THEM
export * from './reset-password.interceptor';    // <-- THEM
```

---

## Buoc 6: Viet lai Auth Service (Xu ly Logic)

**File:** `src/core/modules/auth/service/auth.service.js`

Day la file quan trong nhat, chua toan bo business logic cho 5 API. Service goi xuong Repository va su dung cac utility co san (`JwtService`, `BcryptService`).

```js
import crypto from 'crypto';
import { JwtPayload } from 'core/modules/auth/dto/jwt-sign.dto';
import { BcryptService } from './bcrypt.service';
import { JwtService } from './jwt.service';
import { UserRepository } from '../../user/user.repository';
import { RefreshTokenRepository } from '../repository/refresh-token.repository';
import { PasswordResetTokenRepository } from '../repository/password-reset-token.repository';
import connection, { getTransaction } from 'core/database';
import { EXPIRE_DAYS } from '../../../env';
import {
    UnAuthorizedException,
    NotFoundException,
    DuplicateException,
    BadRequestException,
} from '../../../../packages/httpException';

// Thoi gian song cua refresh token: 30 ngay
const REFRESH_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000;

// Chuyen doi EXPIRE_DAYS (vd: '1d') thanh so giay (vd: 86400) cho response expires_in
function parseTtlToSeconds(ttl) {
    if (!ttl) return 86400;
    const match = ttl.match(/^(\d+)([smhd])$/);
    if (!match) return 86400;
    const [, num, unit] = match;
    const multipliers = { s: 1, m: 60, h: 3600, d: 86400 };
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

    // ============================
    // API 1: LOGIN
    // ============================
    // Luong xu ly:
    //   1. Tim user theo email (tra ve object voi password_hash, role, fullName)
    //   2. So sanh password voi password_hash bang bcrypt
    //   3. Tao access token (JWT) va refresh token (random string luu DB)
    //   4. Tra ve { access_token, refresh_token, expires_in, user }
    async login(loginDto) {
        const user = await this.userRepository.findByEmail(loginDto.email);

        if (!user) {
            throw new UnAuthorizedException('Email or password is incorrect');
        }

        if (!this.bcryptService.compare(loginDto.password, user.password_hash)) {
            throw new UnAuthorizedException('Email or password is incorrect');
        }

        const accessToken = this.jwtService.sign(JwtPayload({ id: user.id, roles: [user.role] }));
        const refreshToken = await this.#createRefreshToken(user.id);

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

    // ============================
    // API 2: REGISTER
    // ============================
    // Luong xu ly:
    //   1. Kiem tra email da ton tai chua -> 409 neu trung
    //   2. Kiem tra phone da ton tai chua -> 409 neu trung
    //   3. Tim role_id tu ten role (vd: 'candidate' -> uuid cua role)
    //   4. Hash password bang bcrypt
    //   5. Transaction: insert user + insert profile
    //   6. Tra ve { user_id, email, role }
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

        return {
            user_id: userId,
            email: registerDto.email,
            role: registerDto.role,
        };
    }

    // ============================
    // API 3: REFRESH TOKEN
    // ============================
    // Luong xu ly:
    //   1. Tim refresh token trong DB (chua revoke, chua het han)
    //   2. Lay thong tin user moi nhat tu DB
    //   3. Revoke token cu (token rotation — bao mat)
    //   4. Tao cap token moi (access + refresh)
    //   5. Tra ve { access_token, refresh_token }
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

        const accessToken = this.jwtService.sign(JwtPayload({ id: user.id, roles: [user.role] }));
        const newRefreshToken = await this.#createRefreshToken(user.id);

        return {
            access_token: accessToken,
            refresh_token: newRefreshToken,
        };
    }

    // ============================
    // API 4: FORGOT PASSWORD
    // ============================
    // Luong xu ly:
    //   1. Tim user theo email -> 404 neu khong tim thay
    //   2. Tao ma OTP (6 chu so) voi thoi han 15 phut
    //   3. Luu OTP vao bang password_reset_tokens
    //   4. Tra ve OTP (TODO: gui qua email khi co email service)
    async forgotPassword(forgotPasswordDto) {
        const user = await this.userRepository.findByEmailExists(forgotPasswordDto.email);

        // Tra ve cung message du email ton tai hay khong — chong email enumeration
        if (!user) {
            return {
                message: 'Neu email ton tai trong he thong, ma OTP se duoc gui den email cua ban.',
            };
        }

        const otp = crypto.randomInt(100000, 999999).toString();
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 phut

        await this.passwordResetTokenRepository.createToken(user.id, otp, expiresAt);

        // TODO: Send OTP via email when email service is integrated
        return {
            message: 'Neu email ton tai trong he thong, ma OTP se duoc gui den email cua ban.',
            otp,
        };
    }

    // ============================
    // API 5: RESET PASSWORD
    // ============================
    // Luong xu ly:
    //   1. Tim OTP trong DB (chua used, chua het han) -> 400 neu khong hop le
    //   2. Hash mat khau moi
    //   3. Transaction:
    //      a. Cap nhat password_hash trong bang users
    //      b. Danh dau OTP da used
    //      c. Revoke tat ca refresh token cua user (ep dang nhap lai moi thiet bi)
    //   4. Tra ve thong bao thanh cong
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
    // PRIVATE: Tao refresh token
    // ============================
    // Refresh token la chuoi random (KHONG phai JWT) — doc lap voi access token.
    // Luu vao DB voi thoi han 30 ngay.
    async #createRefreshToken(userId) {
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);
        await this.refreshTokenRepository.createToken(userId, token, expiresAt);
        return token;
    }
}

export const AuthService = new Service();
```

**Giai thich chi tiet:**

### Cac dependency duoc su dung:
| Import | Tu dau | Muc dich |
|--------|--------|----------|
| `crypto` | Node.js built-in | Tao random token cho refresh va reset password |
| `JwtPayload` | `core/modules/auth/dto/jwt-sign.dto` | Map `{ id, roles }` thanh JWT payload |
| `BcryptService` | `./bcrypt.service` | Hash va compare password |
| `JwtService` | `./jwt.service` | Sign/verify JWT token |
| `UserRepository` | `../../user/user.repository` | Truy van bang `users` |
| `RefreshTokenRepository` | `../repository/refresh-token.repository` | CRUD bang `refresh_tokens` |
| `PasswordResetTokenRepository` | `../repository/password-reset-token.repository` | CRUD bang `password_reset_tokens` |
| `connection, getTransaction` | `core/database` | Knex connection va transaction |
| `EXPIRE_DAYS` | `../../../env` | Cau hinh TTL cua access token (vd: `'1d'`) |
| Exceptions | `../../../../packages/httpException` | Tra loi HTTP voi status code phu hop |

### Quyet dinh thiet ke quan trong:

1. **Refresh token la opaque string (KHONG phai JWT):**
   - Dung `crypto.randomBytes(32).toString('hex')` tao chuoi 64 ky tu hex.
   - Kiem tra hop le bang cach tra cuu DB, khong phai verify JWT.
   - Ly do: don gian hon, tranh van de TTL khong khop giua access va refresh token.

2. **Token rotation khi refresh:**
   - Khi dung refresh token, token cu bi revoke va tao token moi.
   - Ly do: giam thiet hai neu refresh token bi lo — token cu khong con su dung duoc.

3. **Reset password revoke tat ca refresh token:**
   - Ep user dang nhap lai tren MOI thiet bi sau khi doi mat khau.
   - Ly do: dam bao session cu (co the cua ke tan cong) khong con gia tri.

4. **JWT payload: `{ id, roles: [role] }`**
   - Giu `roles` la array de tuong thich voi `UserDetail.toRoles()` trong `packages/authModel`.
   - Du schema moi chi co 1 role per user, viec dung array dam bao guard cu van hoat dong.

5. **Transaction cho register va reset-password:**
   - Register: insert user + insert profile phai thanh cong ca 2 hoac khong insert gi.
   - Reset: update password + mark token used + revoke sessions phai atomic.
   - Dung `getTransaction()` tu `core/database`.

6. **Forgot-password tra ve OTP trong response (dev mode):**
   - Du an chua co email service (khong co nodemailer/sendgrid).
   - Tam thoi tra ve `otp` truc tiep de test tren Swagger UI.
   - TODO: Khi tich hop email service, xoa `otp` khoi response va gui qua email.

---

## Buoc 7: Viet lai Controller (Xu ly Request/Response)

**File:** `src/core/api/auth/auth.controller.js`

Controller khong chua logic, chi extract du lieu tu request va delegate cho Service:

```js
import { AuthService } from '../../modules/auth/service/auth.service';
import { LoginDto, RegisterDto, RefreshDto, ForgotPasswordDto, ResetPasswordDto } from '../../modules/auth';
import { ValidHttpResponse } from '../../../packages/handler/response/validHttp.response';

class Controller {
    constructor() {
        this.service = AuthService;
    }

    login = async req => {
        const data = await this.service.login(LoginDto(req.body));
        return ValidHttpResponse.toOkResponse(data);
    };

    register = async req => {
        const data = await this.service.register(RegisterDto(req.body));
        return ValidHttpResponse.toOkResponse(data);
    };

    refresh = async req => {
        const data = await this.service.refresh(RefreshDto(req.body));
        return ValidHttpResponse.toOkResponse(data);
    };

    forgotPassword = async req => {
        const data = await this.service.forgotPassword(ForgotPasswordDto(req.body));
        return ValidHttpResponse.toOkResponse(data);
    };

    resetPassword = async req => {
        const data = await this.service.resetPassword(ResetPasswordDto(req.body));
        return ValidHttpResponse.toOkResponse(data);
    };
}

export const AuthController = new Controller();
```

**Giai thich:**
- Moi handler la arrow function (de giu `this` context khi pass vao resolver).
- Tat ca 5 handler deu su dung DTO tuong ung (`LoginDto`, `RegisterDto`, `RefreshDto`, `ForgotPasswordDto`, `ResetPasswordDto`) de extract chi cac field can thiet tu `req.body`.
- `ValidHttpResponse.toOkResponse(data)` tra ve HTTP 200 voi data.
- Interceptor da validate body TRUOC khi vao controller, nen khong can validate lai.

---

## Buoc 8: Viet lai Resolver (Dinh tuyen Route)

**File:** `src/core/api/auth/auth.resolver.js`

Resolver dang ky 5 route vao he thong Express router:

```js
import {
    LoginInterceptor,
    RegisterInterceptor,
    RefreshInterceptor,
    ForgotPasswordInterceptor,
    ResetPasswordInterceptor,
} from 'core/modules/auth';
import { Module } from 'packages/handler/Module';
import { AuthController } from './auth.controller';

export const AuthResolver = Module.builder()
    .addPrefix({
        prefixPath: '/auth/v1',
        tag: 'auth',
        module: 'AuthModule',
    })
    .register([
        {
            route: '/login',
            method: 'post',
            interceptors: [LoginInterceptor],
            body: 'LoginDto',
            controller: AuthController.login,
        },
        {
            route: '/register',
            method: 'post',
            interceptors: [RegisterInterceptor],
            body: 'RegisterDto',
            controller: AuthController.register,
        },
        {
            route: '/refresh',
            method: 'post',
            interceptors: [RefreshInterceptor],
            body: 'RefreshDto',
            controller: AuthController.refresh,
        },
        {
            route: '/forgot-password',
            method: 'post',
            interceptors: [ForgotPasswordInterceptor],
            body: 'ForgotPasswordDto',
            controller: AuthController.forgotPassword,
        },
        {
            route: '/reset-password',
            method: 'post',
            interceptors: [ResetPasswordInterceptor],
            body: 'ResetPasswordDto',
            controller: AuthController.resetPassword,
        },
    ]);
```

**Giai thich:**
- `prefixPath: '/auth/v1'` → tat ca route bat dau bang `/api/auth/v1/...` (prefix `/api` duoc them boi `HandlerResolver`).
- **KHONG co `preAuthorization: true`** — tat ca API auth deu la public (khong can JWT de truy cap).
- Moi route co `interceptors` de validate body truoc khi vao controller.
- Moi route deu co `body` tham chieu Swagger model tuong ung (da dang ky trong DTO files) — giup Swagger hien thi request body va cho phep "Try it out".

---

## Buoc 9: Cap nhat Barrel Export cua Auth Module

### Sua file: `src/core/modules/auth/index.js`

```js
export * from './dto';
export * from './service';
export * from './interceptor';
export * from './repository';        // <-- THEM DONG NAY
```

**Luu y:** `src/core/api/index.js` **KHONG can sua** — `AuthResolver` da duoc dang ky san:

```js
// File: src/core/api/index.js (KHONG THAY DOI)
export const ModuleResolver = HandlerResolver
    .builder()
    .addSwaggerBuilder(ApiDocument)
    .addModule([
        AuthResolver,      // da co san
        UserResolver,
        MediaResolver
    ]);
```

---

## Response Format (theo openapi.yaml)

### POST /api/auth/v1/login — 200 OK

```json
{
  "access_token": "eyJhbGci...",
  "refresh_token": "a1b2c3d4e5f6...",
  "expires_in": 86400,
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "role": "candidate",
    "full_name": "Nguyen Van A"
  }
}
```

### POST /api/auth/v1/login — 401 Unauthorized

```json
{
  "code": "UNAUTHORIZED",
  "message": "Email or password is incorrect"
}
```

### POST /api/auth/v1/register — 200 OK

```json
{
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "role": "candidate"
}
```

### POST /api/auth/v1/register — 409 Conflict

```json
{
  "code": "DUPLICATED",
  "message": "Email already in use"
}
```

### POST /api/auth/v1/refresh — 200 OK

```json
{
  "access_token": "new-eyJhbGci...",
  "refresh_token": "new-a1b2c3d4e5f6..."
}
```

### POST /api/auth/v1/refresh — 401 Unauthorized

```json
{
  "code": "UNAUTHORIZED",
  "message": "Refresh token is invalid or expired"
}
```

### POST /api/auth/v1/forgot-password — 200 OK (email ton tai)

```json
{
  "message": "Neu email ton tai trong he thong, ma OTP se duoc gui den email cua ban.",
  "otp": "123456"
}
```

### POST /api/auth/v1/forgot-password — 200 OK (email khong ton tai)

```json
{
  "message": "Neu email ton tai trong he thong, ma OTP se duoc gui den email cua ban."
}
```

### POST /api/auth/v1/reset-password — 200 OK

```json
{
  "message": "Mat khau da duoc thay doi thanh cong. Ban co the dang nhap ngay bay gio."
}
```

### POST /api/auth/v1/reset-password — 400 Bad Request

```json
{
  "code": "BAD_REQUEST",
  "message": "Ma OTP khong hop le hoac da het han."
}
```

---

## Luong xu ly Request (Flow)

### API 1: POST /auth/v1/login

```
Client (Body: { email, password })
  → SecurityFilter (parse JWT tu header neu co — khong bat buoc)
  → LoginInterceptor (validate body: email + password → 400 neu sai format)
  → AuthController.login
    → LoginDto(req.body) → { email, password }
    → AuthService.login(loginDto)
      → UserRepository.findByEmail(email)
        → SQL: SELECT users.*, roles.name, profiles.full_name
                FROM users JOIN roles LEFT JOIN profiles WHERE email = ?
        → Khong tim thay → throw UnAuthorizedException (401)
      → BcryptService.compare(password, user.password_hash)
        → Khong khop → throw UnAuthorizedException (401)
      → JwtService.sign({ id, roles: [role] }) → access_token
      → #createRefreshToken(userId) → luu vao DB, tra ve token string
      → return { access_token, refresh_token, expires_in, user }
    → ValidHttpResponse.toOkResponse(data)
  → Response 200
```

### API 2: POST /auth/v1/register

```
Client (Body: { email, phone, password, role, full_name })
  → RegisterInterceptor (validate body → 400 neu sai)
  → AuthController.register
    → RegisterDto(req.body) → { email, phone, password, role, full_name }
    → AuthService.register(registerDto)
      → UserRepository.findByEmailExists(email)
        → Trung email → throw DuplicateException (409)
      → connection('profiles').where('phone', phone).first()
        → Trung phone → throw DuplicateException (409)
      → connection('roles').where('name', role).first()
        → Role khong ton tai → throw BadRequestException (400)
      → BcryptService.hash(password) → password_hash
      → Transaction BEGIN
        → UserRepository.insert({ email, password_hash, role_id }) → userId
        → connection('profiles').insert({ user_id, full_name, phone })
      → Transaction COMMIT
      → return { user_id, email, role }
    → ValidHttpResponse.toOkResponse(data)
  → Response 200
```

### API 3: POST /auth/v1/refresh

```
Client (Body: { refresh_token })
  → RefreshInterceptor (validate body → 400 neu sai)
  → AuthController.refresh
    → RefreshDto(req.body) → { refresh_token }
    → AuthService.refresh(refreshDto)
      → RefreshTokenRepository.findValidToken(refresh_token)
        → Khong hop le → throw UnAuthorizedException (401)
      → UserRepository.findById(tokenRecord.user_id)
        → Khong tim thay user → throw UnAuthorizedException (401)
      → RefreshTokenRepository.revokeToken(tokenRecord.id)  ← token rotation
      → JwtService.sign({ id, roles }) → new access_token
      → #createRefreshToken(userId) → new refresh_token
      → return { access_token, refresh_token }
    → ValidHttpResponse.toOkResponse(data)
  → Response 200
```

### API 4: POST /auth/v1/forgot-password

```
Client (Body: { email })
  → ForgotPasswordInterceptor (validate email → 400 neu sai format)
  → AuthController.forgotPassword
    → ForgotPasswordDto(req.body) → { email }
    → AuthService.forgotPassword(forgotPasswordDto)
      → UserRepository.findByEmailExists(email)
        → Khong tim thay → tra ve cung message (chong email enumeration), KHONG throw 404
      → crypto.randomInt(100000, 999999) → otp (6 digits)
      → PasswordResetTokenRepository.createToken(userId, otp, expiresAt=15m)
      → return { message, otp }   ← tra ve OTP trong response de test (TODO: xoa khi co email service)
    → ValidHttpResponse.toOkResponse(data)
  → Response 200
```

### API 5: POST /auth/v1/reset-password

```
Client (Body: { otp, new_password })
  → ResetPasswordInterceptor (validate body → 400 neu sai)
  → AuthController.resetPassword
    → ResetPasswordDto(req.body) → { otp, new_password }
    → AuthService.resetPassword(resetPasswordDto)
      → PasswordResetTokenRepository.findValidToken(otp)
        → OTP khong hop le/het han/da dung → throw BadRequestException (400)
      → BcryptService.hash(new_password) → newPasswordHash
      → Transaction BEGIN
        → UserRepository.update(userId, { password_hash })
        → PasswordResetTokenRepository.markUsed(tokenId)
        → RefreshTokenRepository.revokeAllForUser(userId)  ← ep dang nhap lai
      → Transaction COMMIT
      → return { message }
    → ValidHttpResponse.toOkResponse(data)
  → Response 200
```

---

## Kiem tra (Verification)

### Chuan bi

1. Chay migration: `yarn knex migrate:latest`
2. Chay seed (neu chua co data): `yarn knex seed:run`
3. Khoi dong server: `yarn dev`

### Test tung API

**1. Test Register:**
```bash
curl -X POST http://localhost:3000/api/auth/v1/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "phone": "0901234567",
    "password": "SecurePassword123",
    "role": "candidate",
    "full_name": "Tran Van B"
  }'
```
→ Ky vong: 200 voi `{ user_id, email, role }`

**2. Test Login:**
```bash
curl -X POST http://localhost:3000/api/auth/v1/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "SecurePassword123"
  }'
```
→ Ky vong: 200 voi `{ access_token, refresh_token, expires_in, user }`

**3. Test Login voi user co san (tu seed):**
```bash
curl -X POST http://localhost:3000/api/auth/v1/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "candidate1@example.com",
    "password": "password123"
  }'
```

**4. Test Refresh Token:**
```bash
curl -X POST http://localhost:3000/api/auth/v1/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refresh_token": "<refresh_token_tu_login>"
  }'
```
→ Ky vong: 200 voi cap token moi

**5. Test Forgot Password:**
```bash
curl -X POST http://localhost:3000/api/auth/v1/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "candidate1@example.com"
  }'
```
→ Ky vong: 200 voi `{ message, otp }` (OTP tra ve de test, TODO: xoa khi co email service)

**6. Test Reset Password:**
```bash
curl -X POST http://localhost:3000/api/auth/v1/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "otp": "<otp_tu_forgot_password>",
    "new_password": "NewSecurePassword123"
  }'
```
→ Ky vong: 200 voi `{ message }`

**7. Test dang nhap lai voi mat khau moi:**
```bash
curl -X POST http://localhost:3000/api/auth/v1/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "candidate1@example.com",
    "password": "NewSecurePassword123"
  }'
```

### Test cac truong hop loi

| Test case | API | Input | Ky vong |
|-----------|-----|-------|---------|
| Thieu field | Register | Khong co `email` | 400 Validation Error |
| Email trung | Register | Email da ton tai | 409 Duplicate |
| Phone trung | Register | Phone da ton tai | 409 Duplicate |
| Sai mat khau | Login | Password sai | 401 Unauthorized |
| Email khong ton tai | Login | Email chua dang ky | 401 Unauthorized |
| Token het han | Refresh | Refresh token cu | 401 Unauthorized |
| Token da dung | Refresh | Token da bi revoke | 401 Unauthorized |
| Email khong ton tai | Forgot Password | Email chua dang ky | 200 OK (cung message, khong lo email) |
| OTP sai | Reset Password | OTP random | 400 Bad Request |
| OTP da dung | Reset Password | OTP da used | 400 Bad Request |
| Swagger docs | — | Truy cap `/api-docs` | Hien thi 5 endpoint auth |

---

## Tong ket cac file da tao/sua

### File MOI (12 files):
| # | File | Muc dich |
|---|------|----------|
| 1 | `migrations/20260424130019_create_password_reset_tokens.js` | Tao bang password_reset_tokens |
| 2 | `auth/repository/refresh-token.repository.js` | CRUD cho refresh_tokens |
| 3 | `auth/repository/password-reset-token.repository.js` | CRUD cho password_reset_tokens |
| 4 | `auth/repository/index.js` | Barrel export repositories |
| 5 | `auth/dto/register.dto.js` | DTO + Swagger model cho Register |
| 6 | `auth/dto/refresh.dto.js` | DTO + Swagger model cho Refresh |
| 7 | `auth/dto/forgot-password.dto.js` | DTO + Swagger model cho Forgot Password |
| 8 | `auth/dto/reset-password.dto.js` | DTO + Swagger model cho Reset Password |
| 9 | `auth/interceptor/register.interceptor.js` | Validate register input |
| 10 | `auth/interceptor/refresh.interceptor.js` | Validate refresh input |
| 11 | `auth/interceptor/forgot-password.interceptor.js` | Validate forgot-password input |
| 12 | `auth/interceptor/reset-password.interceptor.js` | Validate reset-password input |

### File SUA (7 files):
| # | File | Thay doi |
|---|------|----------|
| 1 | `user/user.repository.js` | Fix join, column names, them findByEmailExists |
| 2 | `auth/service/auth.service.js` | Viet lai toan bo — 5 method + helper |
| 3 | `auth/dto/index.js` | Them export register, refresh, forgot-password, reset-password DTO |
| 4 | `auth/interceptor/index.js` | Them export 4 interceptor moi |
| 5 | `auth/index.js` | Them export repository |
| 6 | `api/auth/auth.controller.js` | 5 handler methods, su dung DTO cho tat ca endpoints |
| 7 | `api/auth/auth.resolver.js` | 5 routes voi `body` Swagger model cho tat ca endpoints |

### File GIU NGUYEN:
- `auth/service/jwt.service.js` — sign/verify JWT hoat dong tot
- `auth/service/bcrypt.service.js` — hash/compare password hoat dong tot
- `auth/dto/login.dto.js` — DTO login khong doi
- `auth/dto/jwt-sign.dto.js` — JWT payload DTO khong doi
- `auth/interceptor/login.interceptor.js` — Validate login khong doi
- `auth/guard/*` — Guard files khong doi
- `api/index.js` — AuthResolver da duoc dang ky san
