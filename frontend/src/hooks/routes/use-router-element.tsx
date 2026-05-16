import { lazy } from 'react'

import { Route, Routes, useLocation } from 'react-router-dom'

import DisabilityLayout from '@/app/layout/disability-layout'
import LayoutClient from '@/app/layout/layout-client'
import LayoutMain from '@/app/layout/layout-main'
import SuspenseProvider from '@/app/providers/suspense-provider'
import AnimatedLayout from '@/components/animated/animated-layout'
import ProtectedRoute from '@/components/auth/protected-route'
import { ROUTE } from '@/core/constants/path'

// Lazy load components
const HomePage = lazy(() => import('@/pages/home'))
const Login = lazy(() => import('@/pages/auth/login'))
const Register = lazy(() => import('@/pages/auth/register'))
const VerifyAccountEmail = lazy(() => import('@/pages/auth/verify-account-email'))
const AccountSettingsPage = lazy(() => import('@/pages/account/settings'))
const CallPage = lazy(() => import('@/pages/communication/call'))
const VideoCallPage = lazy(() => import('@/pages/communication/video-call'))
const DisabilityDashboardPage = lazy(() => import('@/pages/disability/dashboard'))
const DisabilityNotificationsPage = lazy(() => import('@/pages/disability/notifications'))
const DisabilityNotificationDetailPage = lazy(() => import('@/pages/disability/notifications/detail'))
const DisabilityMessagesPage = lazy(() => import('@/pages/disability/messages'))
const DisabilityJobsPage = lazy(() => import('@/pages/disability/jobs'))
const DisabilityJobDetailPage = lazy(() => import('@/pages/disability/jobs/detail'))
const DisabilityJobMatchDetailPage = lazy(() => import('@/pages/disability/jobs/match-detail'))
const DisabilityApplicationsPage = lazy(() => import('@/pages/disability/applications'))
const DisabilityProfilePage = lazy(() => import('@/pages/disability/profile'))
const DisabilityProfileUpdatePage = lazy(() => import('@/pages/disability/profile/update'))
const DisabilityCvPage = lazy(() => import('@/pages/disability/cv'))
const DisabilityCvEditPage = lazy(() => import('@/pages/disability/cv/edit'))
const DisabilityCvPreviewPage = lazy(() => import('@/pages/disability/cv/preview'))
const BusinessDashboardPage = lazy(() => import('@/pages/business/dashboard'))
const BusinessMessagesPage = lazy(() => import('@/pages/business/messages'))
const BusinessCandidatesPage = lazy(() => import('@/pages/business/candidates'))
const BusinessMatchedCandidatesPage = lazy(() => import('@/pages/business/candidates/matched'))
const BusinessCandidateDetailPage = lazy(() => import('@/pages/business/candidates/detail'))
const BusinessJobsPage = lazy(() => import('@/pages/business/jobs'))
const BusinessJobCreatePage = lazy(() => import('@/pages/business/jobs/create'))
const BusinessSchedulePage = lazy(() => import('@/pages/business/schedule'))
const BusinessProfilePage = lazy(() => import('@/pages/business/profile'))
const BusinessProfileUpdatePage = lazy(() => import('@/pages/business/profile/update'))
const Dashboard = lazy(() => import('@/pages/admin/dashboard'))
const Users = lazy(() => import('@/pages/admin/users'))
const PageNotFound = lazy(() => import('@/pages/404'))

export default function useRoutesElements() {
  const location = useLocation()
  const isAuthPath = [ROUTE.PUBLIC.LOGIN, ROUTE.PUBLIC.REGISTER].some((path) => path === location.pathname)
  const isAdminPath = location.pathname.startsWith('/admin')

  const routeElements = (
    <SuspenseProvider>
      <Routes>
        <Route path={ROUTE.PUBLIC.HOME} element={<HomePage />} />
        <Route path={ROUTE.PUBLIC.LOGIN} element={<Login />} />
        <Route path={ROUTE.PUBLIC.REGISTER} element={<Register />} />
        <Route path={ROUTE.PUBLIC.VERIFY_ACCOUNT_EMAIL} element={<VerifyAccountEmail />} />

        {/* Client protected routes */}
        <Route element={<ProtectedRoute redirectPath={ROUTE.PUBLIC.LOGIN} />}>
          <Route path={ROUTE.DISABILITY.ROOT} element={<DisabilityLayout />}>
            <Route path={ROUTE.DISABILITY.DASHBOARD} element={<DisabilityDashboardPage />} />
            <Route path={ROUTE.DISABILITY.NOTIFICATIONS} element={<DisabilityNotificationsPage />} />
            <Route path={ROUTE.DISABILITY.NOTIFICATION_DETAIL} element={<DisabilityNotificationDetailPage />} />
            <Route path={ROUTE.DISABILITY.MESSAGES} element={<DisabilityMessagesPage />} />
            <Route path={ROUTE.DISABILITY.JOBS} element={<DisabilityJobsPage />} />
            <Route path={ROUTE.DISABILITY.JOB_DETAIL} element={<DisabilityJobDetailPage />} />
            <Route path={ROUTE.DISABILITY.JOB_MATCH_DETAIL} element={<DisabilityJobMatchDetailPage />} />
            <Route path={ROUTE.DISABILITY.APPLICATIONS} element={<DisabilityApplicationsPage />} />
            <Route path={ROUTE.DISABILITY.PROFILE} element={<DisabilityProfilePage />} />
            <Route path={ROUTE.DISABILITY.PROFILE_UPDATE} element={<DisabilityProfileUpdatePage />} />
            <Route path={ROUTE.DISABILITY.CV} element={<DisabilityCvPage />} />
            <Route path={ROUTE.DISABILITY.CV_PREVIEW} element={<DisabilityCvPreviewPage />} />
            <Route path={ROUTE.DISABILITY.CV_EDIT} element={<DisabilityCvEditPage />} />
          </Route>
          <Route element={<LayoutClient />}>
            <Route path={ROUTE.COMMON_PRIVATE.ACCOUNT_SETTINGS} element={<AccountSettingsPage />} />
            <Route path={ROUTE.COMMON_PRIVATE.CALL} element={<CallPage />} />
            <Route path={ROUTE.COMMON_PRIVATE.VIDEO_CALL} element={<VideoCallPage />} />
            <Route path={ROUTE.DISABILITY.DASHBOARD} element={<DisabilityDashboardPage />} />
            <Route path={ROUTE.DISABILITY.NOTIFICATIONS} element={<DisabilityNotificationsPage />} />
            <Route path={ROUTE.DISABILITY.NOTIFICATION_DETAIL} element={<DisabilityNotificationDetailPage />} />
            <Route path={ROUTE.DISABILITY.MESSAGES} element={<DisabilityMessagesPage />} />
            <Route path={ROUTE.DISABILITY.JOBS} element={<DisabilityJobsPage />} />
            <Route path={ROUTE.DISABILITY.JOB_DETAIL} element={<DisabilityJobDetailPage />} />
            <Route path={ROUTE.DISABILITY.JOB_MATCH_DETAIL} element={<DisabilityJobMatchDetailPage />} />
            <Route path={ROUTE.DISABILITY.APPLICATIONS} element={<DisabilityApplicationsPage />} />
            <Route path={ROUTE.DISABILITY.PROFILE} element={<DisabilityProfilePage />} />
            <Route path={ROUTE.DISABILITY.PROFILE_UPDATE} element={<DisabilityProfileUpdatePage />} />
            <Route path={ROUTE.BUSINESS.DASHBOARD} element={<BusinessDashboardPage />} />
            <Route path={ROUTE.BUSINESS.MESSAGES} element={<BusinessMessagesPage />} />
            <Route path={ROUTE.BUSINESS.CANDIDATES} element={<BusinessCandidatesPage />} />
            <Route path={ROUTE.BUSINESS.MATCHED_CANDIDATES} element={<BusinessMatchedCandidatesPage />} />
            <Route path={ROUTE.BUSINESS.CANDIDATE_DETAIL} element={<BusinessCandidateDetailPage />} />
            <Route path={ROUTE.BUSINESS.JOBS} element={<BusinessJobsPage />} />
            <Route path={ROUTE.BUSINESS.JOB_CREATE} element={<BusinessJobCreatePage />} />
            <Route path={ROUTE.BUSINESS.SCHEDULE} element={<BusinessSchedulePage />} />
            <Route path={ROUTE.BUSINESS.PROFILE} element={<BusinessProfilePage />} />
            <Route path={ROUTE.BUSINESS.PROFILE_UPDATE} element={<BusinessProfileUpdatePage />} />
          </Route>
        </Route>

        {/* Admin protected routes */}
        <Route element={<ProtectedRoute redirectPath={ROUTE.PUBLIC.LOGIN} />}>
          <Route path={ROUTE.ADMIN.ROOT} element={<LayoutMain />}>
            <Route path={ROUTE.ADMIN.DASHBOARD} element={<Dashboard />} />
            <Route path={ROUTE.ADMIN.USERS} element={<Users />} />
            <Route path={ROUTE.ADMIN.ANALYTICS.ROOT} element={<span>Analytics</span>} />
            <Route path={ROUTE.ADMIN.ANALYTICS.OVERVIEW} element={<span>Analytics Overview</span>} />
            <Route path={ROUTE.ADMIN.ANALYTICS.SALES} element={<span>Analytics Sales</span>} />
            <Route path={ROUTE.ADMIN.ANALYTICS.USERS} element={<span>Analytics Users</span>} />
            <Route path={ROUTE.ADMIN.ANALYTICS.PERFORMANCE} element={<span>Analytics Performance</span>} />
          </Route>
        </Route>

        <Route path={ROUTE.PUBLIC.NOT_FOUND} element={<PageNotFound />} />
        <Route path='*' element={<PageNotFound />} />
      </Routes>
    </SuspenseProvider>
  )

  if (isAdminPath) {
    return routeElements
  }

  return <AnimatedLayout isAuthPath={isAuthPath}>{routeElements}</AnimatedLayout>
}
