# Hướng Dẫn Chi Tiết Tạo API Match (Matching Module)

Dựa vào kiến trúc **Resolver -> Controller -> Service -> Repository** của dự án, tài liệu này hướng dẫn từng bước xây dựng 2 API Matching:

| # | Method | Endpoint | Mô tả |
|---|--------|----------|-------|
| 1 | GET | `/api/v1/matches/jobs` | Gợi ý việc làm phù hợp cho Candidate |
| 2 | GET | `/api/v1/matches/candidates/:jobId` | Gợi ý ứng viên phù hợp cho 1 Job |

## Tổng Quan Kiến Trúc

API Match được chia thành 2 thư mục chính:
1. **Phần xử lý Logic và Dữ liệu (Module Core):** `src/core/modules/match/`
2. **Phần Định tuyến và Nhận Request (API Route):** `src/core/api/match/`

### Sơ đồ file cần tạo

```
src/
├── core/
│   ├── api/
│   │   ├── match/
│   │   │   ├── index.js                  # Barrel export
│   │   │   ├── match.controller.js       # Controller xử lý request/response
│   │   │   └── match.resolver.js         # Định tuyến route
│   │   └── index.js                      # (SỬA) Đăng ký MatchResolver
│   ├── common/
│   │   └── swagger/
│   │       ├── job-id.js                 # Swagger param cho jobId
│   │       └── index.js                  # (SỬA) Export thêm job-id
│   └── modules/
│       └── match/
│           ├── match.repository.js       # Repository truy vấn DB
│           ├── service/
│           │   └── match.service.js      # Service xử lý logic
│           └── interceptor/
│               ├── match-job-id.interceptor.js  # Validate UUID param
│               └── index.js              # Barrel export
```

---

## Bước 0: Database (Đã có sẵn)

Bảng `matches` đã được tạo trong migration `20260424130012_create_matches.js`:

```
matches
├── id (UUID, PK)
├── job_id (UUID, FK -> jobs.id)
├── candidate_user_id (UUID, FK -> users.id)
├── score (float)
├── status (enum: 'pending' | 'matched' | 'rejected')
├── created_at, updated_at
└── deleted_at
```

Unique constraint: `(job_id, candidate_user_id)` — mỗi ứng viên chỉ có 1 match record cho mỗi job.

Các bảng liên quan cần JOIN khi query:
- `jobs` — thông tin việc làm (title, status, company_id)
- `companies` — tên công ty, user_id (chủ sở hữu)
- `users` — thông tin người dùng
- `profiles` — full_name, disability_status
- `cvs` — skills (JSONB)

---

## Bước 1: Tạo Repository (Giao tiếp Database)

**File:** `src/core/modules/match/match.repository.js`

Repository kế thừa `DataRepository` và triển khai 3 hàm query:

```js
import { DataRepository } from 'packages/restBuilder/core/dataHandler/data.repository';

class Repository extends DataRepository {
    // Lấy danh sách job gợi ý cho 1 candidate
    // JOIN: matches -> jobs -> companies
    // Filter: candidate_user_id, deleted_at IS NULL, jobs.status = 'open'
    // Order: score DESC
    findSuggestedJobsByUserId(userId) {
        return this.query()
            .innerJoin('jobs', 'matches.job_id', 'jobs.id')
            .innerJoin('companies', 'jobs.company_id', 'companies.id')
            .where('matches.candidate_user_id', userId)
            .whereNull('matches.deleted_at')
            .whereNull('jobs.deleted_at')
            .where('jobs.status', 'open')
            .select(
                { job_id: 'matches.job_id' },
                { title: 'jobs.title' },
                { company_name: 'companies.name' },
                { match_score: 'matches.score' },
            )
            .orderBy('matches.score', 'desc');
    }

    // Lấy danh sách candidate gợi ý cho 1 job
    // JOIN: matches -> users -> profiles, LEFT JOIN cvs
    // Filter: job_id, deleted_at IS NULL
    // Order: score DESC
    findSuggestedCandidatesByJobId(jobId) {
        return this.query()
            .innerJoin('users', 'matches.candidate_user_id', 'users.id')
            .innerJoin('profiles', 'profiles.user_id', 'users.id')
            .leftJoin('cvs', 'cvs.profile_id', 'profiles.id')
            .where('matches.job_id', jobId)
            .whereNull('matches.deleted_at')
            .whereNull('users.deleted_at')
            .whereNull('profiles.deleted_at')
            .select(
                { candidate_id: 'matches.candidate_user_id' },
                { full_name: 'profiles.full_name' },
                { match_score: 'matches.score' },
                { highlight_skills: 'cvs.skills' },
                { disability_support: 'profiles.disability_status' },
            )
            .orderBy('matches.score', 'desc');
    }

    // Kiểm tra ai là chủ sở hữu của job (dùng cho authorization)
    // JOIN: jobs -> companies
    // Trả về 1 row duy nhất với jobs.id và companies.user_id
    findJobOwner(jobId) {
        return this.query()
            .from('jobs')
            .innerJoin('companies', 'jobs.company_id', 'companies.id')
            .where('jobs.id', jobId)
            .whereNull('jobs.deleted_at')
            .select('jobs.id', { owner_user_id: 'companies.user_id' })
            .first();
    }
}

export const MatchRepository = new Repository('matches');
```

**Giải thích:**
- `this.query()` trả về Knex query builder trên bảng `matches` (tên bảng truyền vào constructor).
- `findJobOwner` dùng `.from('jobs')` để override bảng gốc vì query bắt đầu từ `jobs`, không phải `matches`.
- `.first()` trả về 1 object thay vì array.
- Luôn filter `whereNull('deleted_at')` để bỏ qua soft-deleted records.

---

## Bước 2: Tạo Service (Xử lý Logic)

**File:** `src/core/modules/match/service/match.service.js`

Service chứa business logic, gọi xuống Repository và format kết quả:

```js
import { NotFoundException, ForbiddenException } from 'packages/httpException';
import { MatchRepository } from '../match.repository';

class Service {
    constructor() {
        this.repository = MatchRepository;
    }

    // API 1: Gợi ý việc làm cho candidate
    // - Lấy danh sách match từ DB
    // - Thêm trường "reason" dựa trên match_score
    // - Trả về format { suggested_jobs: [...] }
    async getSuggestedJobs(userId) {
        const matches = await this.repository.findSuggestedJobsByUserId(userId);

        const suggestedJobs = matches.map(match => ({
            job_id: match.job_id,
            title: match.title,
            company_name: match.company_name,
            match_score: parseFloat(match.match_score) || 0,
            reason: this.#generateReason(match.match_score),
        }));

        return { suggested_jobs: suggestedJobs };
    }

    // API 2: Gợi ý ứng viên cho 1 job
    // - Kiểm tra job có tồn tại không -> 404
    // - Kiểm tra user hiện tại có phải chủ job không -> 403
    // - Lấy danh sách candidate match
    // - Parse skills từ JSONB thành mảng string
    // - Trả về format { job_id, suggested_candidates: [...] }
    async getSuggestedCandidates(jobId, userId) {
        const job = await this.repository.findJobOwner(jobId);

        if (!job) {
            throw new NotFoundException('Khong tim thay cong viec yeu cau');
        }

        if (job.owner_user_id !== userId) {
            throw new ForbiddenException(
                'Ban khong co quyen xem goi y ung vien cho cong viec nay'
            );
        }

        const matches = await this.repository.findSuggestedCandidatesByJobId(jobId);

        const suggestedCandidates = matches.map(match => ({
            candidate_id: match.candidate_id,
            full_name: match.full_name,
            match_score: parseFloat(match.match_score) || 0,
            highlight_skills: this.#parseSkills(match.highlight_skills),
            disability_support: match.disability_support || null,
        }));

        return {
            job_id: jobId,
            suggested_candidates: suggestedCandidates,
        };
    }

    // Parse JSONB skills thành mảng tên skill
    // Input:  [{ "name": "Java", "level": "advanced" }, ...]
    // Output: ["Java", ...]
    #parseSkills(skills) {
        if (!skills) return [];
        const parsed = typeof skills === 'string' ? JSON.parse(skills) : skills;
        if (!Array.isArray(parsed)) return [];
        return parsed.map(skill => skill.name || skill).filter(Boolean);
    }

    // Sinh lý do gợi ý dựa trên điểm match
    #generateReason(score) {
        const numScore = parseFloat(score) || 0;
        if (numScore >= 0.9) return 'Phu hop rat cao voi yeu cau cong viec';
        if (numScore >= 0.7) return 'Phu hop tot voi da so ky nang yeu cau';
        if (numScore >= 0.5) return 'Phu hop mot phan voi yeu cau cong viec';
        return 'Co the phu hop voi mot so yeu cau co ban';
    }
}

export const MatchService = new Service();
```

**Giải thích:**
- `NotFoundException` (404) khi job không tồn tại.
- `ForbiddenException` (403) khi user không phải chủ sở hữu job.
- `#parseSkills` và `#generateReason` là private methods (ES2022 syntax `#`).
- Skills trong DB lưu dạng JSONB `[{ name, level }]`, cần parse thành `["Java", "SQL"]`.

---

## Bước 3: Tạo Interceptor (Validate params)

**Lưu ý:** `DefaultValidatorInterceptor` validate `req.query` cho GET request, nhưng `jobId` nằm trong `req.params`. Do đó cần tạo custom interceptor override `getValueToValidate`.

### File: `src/core/modules/match/interceptor/match-job-id.interceptor.js`

```js
import Joi from 'joi';
import { AbstractInputValidatorInterceptor } from 'core/infrastructure/interceptor/input-validator.interceptor';

class MatchJobIdValidatorInterceptor extends AbstractInputValidatorInterceptor {
    constructor() {
        super();
        this.schema = Joi.object({
            jobId: Joi.string().uuid().required().messages({
                'string.guid': 'jobId must be a valid UUID format',
            }),
        });
    }

    getSchema() {
        return this.schema;
    }

    // Override: validate req.params thay vì req.query
    getValueToValidate(req) {
        return req.params;
    }
}

export const MatchJobIdInterceptor = new MatchJobIdValidatorInterceptor();
```

### File: `src/core/modules/match/interceptor/index.js`

```js
export { MatchJobIdInterceptor } from './match-job-id.interceptor';
```

**Giải thích:**
- Kế thừa `AbstractInputValidatorInterceptor` trực tiếp (không qua `DefaultValidatorInterceptor`).
- Override `getValueToValidate(req)` để trả về `req.params` thay vì `req.query`.
- Validate UUID format bằng `Joi.string().uuid()`.

---

## Bước 4: Tạo Swagger Param

**File:** `src/core/common/swagger/job-id.js`

```js
import { SwaggerDocument } from '../../../packages/swagger';

export const JobIdParam = SwaggerDocument.ApiParams({
    name: 'jobId',
    paramsIn: 'path',
    type: 'string',
    description: 'Job ID (UUID)',
});
```

**Sửa file:** `src/core/common/swagger/index.js` — thêm export:

```js
export * from './filter';
export * from './record-id';
export * from './upload-file';
export * from './job-id';          // <-- THÊM DÒNG NÀY
```

**Giải thích:**
- Đặt chung vào `common/swagger/` (cùng chỗ với `record-id.js`) để các module khác có thể tái sử dụng.
- `paramsIn: 'path'` cho Swagger biết đây là path parameter.

---

## Bước 5: Tạo Controller (Xử lý Request/Response)

**File:** `src/core/api/match/match.controller.js`

```js
import { MatchService } from '../../modules/match/service/match.service';
import { ValidHttpResponse } from '../../../packages/handler/response/validHttp.response';

class Controller {
    constructor() {
        this.service = MatchService;
    }

    // GET /matches/jobs
    // Lấy userId từ JWT payload -> gọi service
    getSuggestedJobs = async req => {
        const userId = req.user.payload.id;
        const data = await this.service.getSuggestedJobs(userId);
        return ValidHttpResponse.toOkResponse(data);
    };

    // GET /matches/candidates/:jobId
    // Lấy jobId từ params, userId từ JWT payload -> gọi service
    getSuggestedCandidates = async req => {
        const { jobId } = req.params;
        const userId = req.user.payload.id;
        const data = await this.service.getSuggestedCandidates(jobId, userId);
        return ValidHttpResponse.toOkResponse(data);
    };
}

export const MatchController = new Controller();
```

**Giải thích:**
- `req.user` được gắn bởi `SecurityFilter` (JWT middleware). Cấu trúc: `req.user.payload = { id, roles }`.
- `req.user.payload.id` chính là `userId` đã decode từ token.
- Controller không chứa logic, chỉ extract params và delegate cho Service.
- `ValidHttpResponse.toOkResponse()` trả về HTTP 200 với data.

---

## Bước 6: Tạo Resolver (Định tuyến Route)

**File:** `src/core/api/match/match.resolver.js`

```js
import { Module } from 'packages/handler/Module';
import { MatchJobIdInterceptor } from 'core/modules/match/interceptor';
import { MatchController } from './match.controller';
import { JobIdParam } from '../../common/swagger';

export const MatchResolver = Module.builder()
    .addPrefix({
        prefixPath: '/matches',
        tag: 'matches',
        module: 'MatchModule',
    })
    .register([
        {
            route: '/jobs',
            method: 'get',
            controller: MatchController.getSuggestedJobs,
            preAuthorization: true,
        },
        {
            route: '/candidates/:jobId',
            method: 'get',
            params: [JobIdParam],
            interceptors: [MatchJobIdInterceptor],
            controller: MatchController.getSuggestedCandidates,
            preAuthorization: true,
        },
    ]);
```

**Giải thích:**
- `prefixPath: '/matches'` -> tất cả route bắt đầu bằng `/api/v1/matches`.
- `preAuthorization: true` -> middleware kiểm tra JWT token tồn tại (trả 401 nếu không có).
- Route 1 (`/jobs`): không cần interceptor vì không có input params.
- Route 2 (`/candidates/:jobId`): có `params` (Swagger) + `interceptors` (validate UUID).
- Ownership check (403) được xử lý ở Service layer, không dùng guard.

---

## Bước 7: Đăng ký Module vào hệ thống

### File: `src/core/api/match/index.js`

```js
export * from './match.resolver';
```

### Sửa file: `src/core/api/index.js`

```js
import { MediaResolver } from 'core/api/media';
import { UserResolver } from 'core/api/user/user.resolver';
import { MatchResolver } from 'core/api/match';           // <-- THÊM
import { ApiDocument } from 'core/config/swagger.config';
import { HandlerResolver } from '../../packages/handler/HandlerResolver';
import { AuthResolver } from './auth/auth.resolver';

export const ModuleResolver = HandlerResolver
    .builder()
    .addSwaggerBuilder(ApiDocument)
    .addModule([
        AuthResolver,
        UserResolver,
        MediaResolver,
        MatchResolver,                                     // <-- THÊM
    ]);
```

---

## Response Format (theo openapi.yaml)

### GET /api/v1/matches/jobs — 200 OK

```json
{
  "suggested_jobs": [
    {
      "job_id": "uuid-job-999",
      "title": "Junior Node.js Developer",
      "company_name": "Origin Tech",
      "match_score": 92.5,
      "reason": "Phu hop rat cao voi yeu cau cong viec"
    }
  ]
}
```

### GET /api/v1/matches/jobs — 401 Unauthorized

```json
{
  "status": "error",
  "message": "Ban can dang nhap de nhan goi y viec lam"
}
```

### GET /api/v1/matches/candidates/:jobId — 200 OK

```json
{
  "job_id": "uuid-job-789",
  "suggested_candidates": [
    {
      "candidate_id": "uuid-user-111",
      "full_name": "Nguyen Van A",
      "match_score": 95.0,
      "highlight_skills": ["Java", "Spring Boot", "SQL"],
      "disability_support": "visual_impairment"
    }
  ]
}
```

### GET /api/v1/matches/candidates/:jobId — 403 Forbidden

```json
{
  "status": "error",
  "message": "Ban khong co quyen xem goi y ung vien cho cong viec nay"
}
```

### GET /api/v1/matches/candidates/:jobId — 404 Not Found

```json
{
  "status": "error",
  "message": "Khong tim thay cong viec yeu cau"
}
```

---

## Luồng xử lý Request (Flow)

### API 1: GET /matches/jobs

```
Client (Bearer Token)
  → SecurityFilter (decode JWT, gắn req.user)
  → preAuthorization middleware (kiểm tra req.user tồn tại → 401 nếu không)
  → MatchController.getSuggestedJobs
    → extract userId từ req.user.payload.id
    → MatchService.getSuggestedJobs(userId)
      → MatchRepository.findSuggestedJobsByUserId(userId)
        → SQL: SELECT matches JOIN jobs JOIN companies WHERE candidate_user_id = ?
      → map results, thêm field "reason"
      → return { suggested_jobs: [...] }
    → ValidHttpResponse.toOkResponse(data)
  → Response 200
```

### API 2: GET /matches/candidates/:jobId

```
Client (Bearer Token)
  → SecurityFilter (decode JWT, gắn req.user)
  → preAuthorization middleware (kiểm tra req.user tồn tại → 401 nếu không)
  → MatchJobIdInterceptor (validate jobId là UUID → 400 nếu sai format)
  → MatchController.getSuggestedCandidates
    → extract jobId từ req.params, userId từ req.user.payload.id
    → MatchService.getSuggestedCandidates(jobId, userId)
      → MatchRepository.findJobOwner(jobId)
        → Không tìm thấy → throw NotFoundException (404)
        → owner_user_id !== userId → throw ForbiddenException (403)
      → MatchRepository.findSuggestedCandidatesByJobId(jobId)
        → SQL: SELECT matches JOIN users JOIN profiles LEFT JOIN cvs WHERE job_id = ?
      → parse skills JSONB → string array
      → return { job_id, suggested_candidates: [...] }
    → ValidHttpResponse.toOkResponse(data)
  → Response 200
```

---

## Kiểm tra (Verification)

1. Khởi động server: `yarn dev`
2. Đăng nhập lấy token: `POST /api/v1/auth` với `{ "email": "candidate1@example.com", "password": "password123" }`
3. Test API 1: `GET /api/v1/matches/jobs` (Header: `Authorization: Bearer <token>`)
4. Đăng nhập recruiter: `POST /api/v1/auth` với `{ "email": "recruiter1@example.com", "password": "password123" }`
5. Test API 2: `GET /api/v1/matches/candidates/<job_id>` (Header: `Authorization: Bearer <token>`)
6. Test 401: gọi API không có token
7. Test 403: gọi API 2 với recruiter không sở hữu job
8. Test 404: gọi API 2 với job_id không tồn tại
9. Kiểm tra Swagger docs tại `/api-docs`
