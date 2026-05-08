import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ children }) {
  const { currentUser } = useAuth()
  const location = useLocation()

  if (!currentUser) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (!currentUser.emailVerified) {
    return <Navigate to="/login" replace state={{ message: 'Please verify your email to continue.' }} />
  }

  return children
}

export default ProtectedRoute
