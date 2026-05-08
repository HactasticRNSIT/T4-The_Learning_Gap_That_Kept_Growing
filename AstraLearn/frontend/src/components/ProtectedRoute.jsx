// src/components/ProtectedRoute.jsx

import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children }) => {

  const { currentUser } = useAuth()

  if (!currentUser) {
    return <Navigate to='/login' />
  }

  if (!currentUser.emailVerified) {
    return <Navigate to='/register' />
  }

  return children
}

export default ProtectedRoute