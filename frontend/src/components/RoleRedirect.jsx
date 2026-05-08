import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { getPortalPath } from '../utils/roles'

function RoleRedirect() {
  const { userProfile } = useAuth()

  return <Navigate to={getPortalPath(userProfile?.role)} replace />
}

export default RoleRedirect
