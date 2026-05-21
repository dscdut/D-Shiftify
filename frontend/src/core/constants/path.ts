// Public routes: accessible without authentication.
const PUBLIC = {
  HOME: '/',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  VERIFY_ACCOUNT_EMAIL: '/auth/verify-account-email',
  FORGOT_PASSWORD: '/auth/forgot-password',
  NOT_FOUND: '/404'
} as const

// Common private routes: shared routes accessible after authentication.
const COMMON_PRIVATE = {
  ACCOUNT_SETTINGS: '/account/settings',
  CHAT: '/chat',
  CALL: '/call',
  VIDEO_CALL: '/video-call'
} as const

// Disability routes: private routes for disability users and job seekers.
const DISABILITY = {
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
} as const

// Business routes: private routes for business users and recruiters.
const BUSINESS = {
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
} as const

const ADMIN = {
  ROOT: '/admin',
  DASHBOARD: 'dashboard',
  USERS: 'users',
  ANALYTICS: {
    ROOT: 'analytics',
    OVERVIEW: 'analytics/overview',
    SALES: 'analytics/sales',
    USERS: 'analytics/users',
    PERFORMANCE: 'analytics/performance'
  }
} as const

export const ROUTE = {
  PUBLIC,
  COMMON_PRIVATE,
  DISABILITY,
  BUSINESS,
  ADMIN
} as const

export const PUBLIC_ROUTES = Object.values(ROUTE.PUBLIC)

export const COMMON_PRIVATE_ROUTES = Object.values(ROUTE.COMMON_PRIVATE)

export const DISABILITY_ROUTES = Object.values(ROUTE.DISABILITY)

export const BUSINESS_ROUTES = Object.values(ROUTE.BUSINESS)
