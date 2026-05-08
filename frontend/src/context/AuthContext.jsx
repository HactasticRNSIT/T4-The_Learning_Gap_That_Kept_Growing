import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  reload,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { auth } from '../firebase/firebase'

const AuthContext = createContext(null)

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = useMemo(
    () => ({
      currentUser,
      loading,
      async register({ name, email, password }) {
        const credential = await createUserWithEmailAndPassword(auth, email, password)
        await updateProfile(credential.user, { displayName: name })
        await sendEmailVerification(credential.user)
        return credential.user
      },
      async login(email, password) {
        const credential = await signInWithEmailAndPassword(auth, email, password)
        await reload(credential.user)

        if (!credential.user.emailVerified) {
          await signOut(auth)
          throw new Error('Please verify your email before logging in.')
        }

        return credential.user
      },
      async verifyCurrentUser() {
        if (!auth.currentUser) {
          throw new Error('Your session has expired. Please register or log in again.')
        }

        await reload(auth.currentUser)

        if (!auth.currentUser.emailVerified) {
          throw new Error('Email is not verified yet. Please check your inbox and try again.')
        }

        setCurrentUser({ ...auth.currentUser })
        return auth.currentUser
      },
      resetPassword(email) {
        return sendPasswordResetEmail(auth, email)
      },
      logout() {
        return signOut(auth)
      },
    }),
    [currentUser, loading],
  )

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-ink text-white">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-cyan-300 border-t-transparent" />
      </div>
    )
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
