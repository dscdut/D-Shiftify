import { type ReactNode } from 'react'

import { Outlet } from 'react-router-dom'

interface ProtectedRouteProps {
  children?: ReactNode
  redirectPath?: string
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // const { isAuthenticated } = useAuth()
  // const location = useLocation()
  // const navigate = useNavigate()

  // useEffect(() => {
  //   const accessToken = getAccessTokenFromLS()
  //   if (!accessToken) {
  //     navigate(ROUTE.PUBLIC.HOME, { replace: true })
  //   }
  // }, [location.pathname, navigate])

  // if (!isAuthenticated) {
  //   return <Navigate to={redirectPath} state={{ from: location }} replace />
  // }

  return children ? <>{children}</> : <Outlet />
}

export default ProtectedRoute
