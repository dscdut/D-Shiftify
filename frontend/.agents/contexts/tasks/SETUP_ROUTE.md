# TASK: Define Route Constants and Generate Missing Page Files for D Shiftify

You are a Senior Frontend Developer.

Implement the following task for the existing React + Vite + TypeScript project.

---

# 1. Project Context

The current project is called **D Shiftify**.

This platform helps:

- People with disabilities create CVs
- People with disabilities discover suitable jobs
- People with disabilities apply for jobs
- Businesses discover suitable candidates
- Businesses manage candidates and recruitment workflows

The project currently uses a **layer-based architecture**, NOT feature-first architecture.

You MUST follow the existing project structure and architecture conventions.

Current project structure:

```txt
public/
src/
├── app/
│ ├── layout/
│ └── providers/
├── assets/
├── components/
├── core/
│ ├── configs/
│ ├── lib/
│ └── store/
├── hooks/
├── locales/
├── models/
├── pages/
├── services/
├── styles/
├── App.tsx
└── main.tsx
```

---

# 2. Main Goal

Create the following file:

```txt
src/core/constants/route.ts
```

This file must export a `ROUTE` constant containing the entire application route structure.

After defining routes:

- Create missing page files inside `src/pages/`
- Keep all existing files intact
- Do NOT overwrite important existing logic
- Only create missing pages
- Placeholder pages are enough
- Do NOT refactor the entire project
- Do NOT change the architecture
- Do NOT switch to feature-first architecture

---

# 3. Route Grouping Requirement

Routes must be clearly separated into:

1. PUBLIC ROUTES
   Accessible by everyone without authentication.

2. DISABILITY USER ROUTES
   Only for disability users / job seekers.

3. BUSINESS ROUTES
   Only for business users / recruiters.

4. COMMON PRIVATE ROUTES
   Shared routes accessible after authentication.

---

# 4. User Flow From Figma

Based on the provided Figma flow, the system has 2 major user flows.

---

# 4.1 Disability User Flow

Flow:

- Start
- Landing Page
- Sign Up / Login
- Dashboard

Dashboard sections:

- Notifications
- Messages
- Job Discovery
- Applications
- Profile
- Avatar / Account Menu

---

## Notifications

- UC16 Screen
- View company notifications
- View job details

---

## Messages

- UC18 + UC19 Screens
- Audio Call
- Video Call
- Call Screen
- Video Call Screen

---

## Job Discovery

- UC11 Screen
- Job Match Detail Screen
- UC12 Screen
- Job Detail Screen
- User clicks job card
- User filters jobs
- User selects matching score

---

## Applications

- Application Page

---

## Profile

- UC3: Update Profile
- UC4: Create & Edit CV
- UC5: CV Update
- UC7: CV Page

---

## Avatar Menu

- Account Settings
- Logout

---

# 4.2 Business User Flow

Flow:

- Start
- Landing Page
- Sign Up / Login
- Dashboard

Dashboard sections:

- Messages
- Candidates
- Job Listings
- Schedule
- Profile
- Avatar / Account Menu

---

## Messages

- UC20 Message Screen
- Audio Call
- Video Call
- Call Screen
- Video Call Screen

---

## Candidates

- UC17 Applied Candidates
- UC13 Matching Candidates
- Candidate Detail Screen

---

## Job Listings

- Job List Screen
- Create Job Button
- UC8 Create Job Screen

---

## Schedule

- Schedule Page

---

## Profile

- UC9 Update Profile

---

## Avatar Menu

- Account Settings
- Logout

---

# 5. Required Route Structure

Create:

```txt
src/core/constants/route.ts
```

The file must contain:

- ROUTE.PUBLIC
- ROUTE.DISABILITY
- ROUTE.BUSINESS
- ROUTE.COMMON_PRIVATE

Naming must be clear and consistent.

---

# 6. Suggested Route Structure

```ts
export const ROUTE = {
  PUBLIC: {
    HOME: '/',
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    NOT_FOUND: '/404'
  },

  COMMON_PRIVATE: {
    ACCOUNT_SETTINGS: '/account/settings',
    CALL: '/call',
    VIDEO_CALL: '/video-call'
  },

  DISABILITY: {
    DASHBOARD: '/dashboard/disability',
    NOTIFICATIONS: '/disability/notifications',
    NOTIFICATION_DETAIL: '/disability/notifications/:id',
    MESSAGES: '/disability/messages',
    JOBS: '/disability/jobs',
    JOB_DETAIL: '/disability/jobs/:id',
    JOB_MATCH_DETAIL: '/disability/jobs/:id/match',
    APPLICATIONS: '/disability/applications',
    PROFILE: '/disability/profile',
    PROFILE_UPDATE: '/disability/profile/update',
    CV: '/disability/cv',
    CV_CREATE: '/disability/cv/create',
    CV_EDIT: '/disability/cv/edit/:id',
    CV_UPDATE: '/disability/cv/update'
  },

  BUSINESS: {
    DASHBOARD: '/dashboard/business',
    MESSAGES: '/business/messages',
    CANDIDATES: '/business/candidates',
    MATCHED_CANDIDATES: '/business/candidates/matched',
    CANDIDATE_DETAIL: '/business/candidates/:id',
    JOBS: '/business/jobs',
    JOB_CREATE: '/business/jobs/create',
    SCHEDULE: '/business/schedule',
    PROFILE: '/business/profile',
    PROFILE_UPDATE: '/business/profile/update'
  }
} as const

export const PUBLIC_ROUTES = Object.values(ROUTE.PUBLIC)

export const COMMON_PRIVATE_ROUTES = Object.values(ROUTE.COMMON_PRIVATE)

export const DISABILITY_ROUTES = Object.values(ROUTE.DISABILITY)

export const BUSINESS_ROUTES = Object.values(ROUTE.BUSINESS)
```

---

# 7. Page File Creation Requirement

After defining routes, create missing pages inside:

```txt
src/pages/
```

Suggested structure:

```txt
src/pages/
├── 404/
│ └── index.tsx
├── auth/
│ ├── login.tsx
│ └── register.tsx
├── home/
│ └── index.tsx
├── account/
│ └── settings.tsx
├── communication/
│ ├── call.tsx
│ └── video-call.tsx
├── disability/
│ ├── dashboard.tsx
│ ├── notifications/
│ │ ├── index.tsx
│ │ └── detail.tsx
│ ├── messages/
│ │ └── index.tsx
│ ├── jobs/
│ │ ├── index.tsx
│ │ ├── detail.tsx
│ │ └── match-detail.tsx
│ ├── applications/
│ │ └── index.tsx
│ ├── profile/
│ │ ├── index.tsx
│ │ └── update.tsx
│ └── cv/
│ ├── index.tsx
│ ├── create.tsx
│ ├── edit.tsx
│ └── update.tsx
└── business/
├── dashboard.tsx
├── messages/
│ └── index.tsx
├── candidates/
│ ├── index.tsx
│ ├── matched.tsx
│ └── detail.tsx
├── jobs/
│ ├── index.tsx
│ └── create.tsx
├── schedule/
│ └── index.tsx
└── profile/
├── index.tsx
└── update.tsx
```

---

# 8. Placeholder Page Rules

Each newly created page only needs a simple placeholder component.

Example:

```tsx
export default function DisabilityDashboardPage() {
  return (
    <main>
      <h1>Disability Dashboard</h1>
      <p>This page is for disability users.</p>
    </main>
  )
}
```

Requirements:

- Use PascalCase component names
- Do NOT implement API logic
- Do NOT add large mock data
- Do NOT create complex UI
- Placeholder text must clearly describe the page purpose

---

# 9. Existing File Rules

If a file already exists:

- Do NOT delete it
- Do NOT overwrite important logic
- Only create missing files
- Only minimally update routing if necessary

---

# 10. Routing Integration

Check:

```txt
src/hooks/use-router-element.tsx
```

If routing is defined there:

- Import ROUTE from `route.ts`
- Replace hardcoded paths with ROUTE constants
- Add missing routes

If routing is defined in `App.tsx`:

- Update routing minimally
- Keep existing layouts/providers intact

---

# 11. Access Classification

Inside `route.ts`, clearly comment:

- Public routes
- Disability routes
- Business routes
- Common private routes

Complex route guards are NOT required yet.

The goal is to prepare a scalable route structure for future access control.

---

# 12. Naming Conventions

Follow:

- React components: PascalCase
- Hooks: use-name.ts
- Services: name.service.ts
- Folders: kebab-case

Avoid vague names like:

- TestPage
- DemoPage
- TempPage

---

# 13. Expected Output

After completion, the project must contain:

1. Route constant file:

```txt
src/core/constants/route.ts
```

2. Missing pages created under:

```txt
src/pages/
```

3. Updated router integration if necessary.

4. No TypeScript errors.

5. No major linting issues.

6. Existing pages remain intact.

---

# 14. Final Check

After implementation, run:

```bash
yarn check:type
yarn lint
```

If the project uses different scripts, use the scripts already defined in `package.json`.

Do NOT:

- change the package manager
- refactor the architecture
- convert the project to feature-first architecture
