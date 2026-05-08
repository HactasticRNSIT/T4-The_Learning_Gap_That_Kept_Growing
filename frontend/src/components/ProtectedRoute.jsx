import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { getPortalPath, normalizeRole } from '../utils/roles'

function ProtectedRoute({ allowedRoles, children }) {
  const { currentUser, userProfile } = useAuth()
  const location = useLocation()

  if (!currentUser) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (!currentUser.emailVerified) {
    return <Navigate to="/login" replace state={{ message: 'Please verify your email to continue.' }} />
  }

  if (allowedRoles?.length && userProfile?.role && !allowedRoles.includes(userProfile.role)) {
    return <Navigate to={getPortalPath(normalizeRole(userProfile.role))} replace />
  }

  return children
}

export default ProtectedRoute
