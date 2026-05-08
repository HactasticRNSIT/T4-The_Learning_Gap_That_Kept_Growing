import { useEffect, useMemo, useState } from 'react'
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
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { auth, db } from '../firebase/firebase'
import { normalizeRole } from '../utils/roles'
import AuthContext from './AuthContextCore'

const localRoleKey = (uid) => `astralearn:user-role:${uid}`
const localProfileKey = (uid) => `astralearn:user-profile:${uid}`

function getAuthActionUrl(path = '/login') {
  const fallbackOrigin = 'http://localhost:5173'
  const origin = typeof window !== 'undefined' && window.location?.origin ? window.location.origin : fallbackOrigin
  return `${origin}${path}`
}

function readLocalProfile(user) {
  if (!user) return null

  try {
    const cachedProfile = localStorage.getItem(localProfileKey(user.uid))
    if (cachedProfile) {
      const profile = JSON.parse(cachedProfile)
      return { ...profile, role: normalizeRole(profile.role) }
    }

    const cachedRole = localStorage.getItem(localRoleKey(user.uid))
    return {
      id: user.uid,
      uid: user.uid,
      name: user.displayName || 'AstraLearn User',
      email: user.email,
      phone: user.phoneNumber || '',
      role: normalizeRole(cachedRole),
      storageMode: 'local',
    }
  } catch {
    return {
      id: user.uid,
      uid: user.uid,
      name: user.displayName || 'AstraLearn User',
      email: user.email,
      phone: user.phoneNumber || '',
      role: 'teacher',
      storageMode: 'local',
    }
  }
}

function writeLocalProfile(user, profile) {
  try {
    localStorage.setItem(localRoleKey(user.uid), normalizeRole(profile.role))
    localStorage.setItem(
      localProfileKey(user.uid),
      JSON.stringify({
        id: user.uid,
        uid: user.uid,
        name: profile.name || user.displayName || 'AstraLearn User',
        email: profile.email || user.email,
        phone: profile.phone || user.phoneNumber || '',
        role: normalizeRole(profile.role),
        storageMode: 'local',
      }),
    )
  } catch {
    // Local role caching is a fallback only; auth should keep working even if storage is blocked.
  }
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadUserProfile = async (user) => {
    if (!user) return null

    try {
      const profileRef = doc(db, 'users', user.uid)
      const snapshot = await getDoc(profileRef)

      if (snapshot.exists()) {
        const profile = { id: snapshot.id, ...snapshot.data(), role: normalizeRole(snapshot.data().role), storageMode: 'firestore' }
        writeLocalProfile(user, profile)
        setUserProfile(profile)
        return profile
      }

      const fallbackProfile = {
        uid: user.uid,
        name: user.displayName || 'AstraLearn User',
        email: user.email,
        phone: user.phoneNumber || '',
        role: normalizeRole(localStorage.getItem(localRoleKey(user.uid))),
        createdAt: serverTimestamp(),
      }

      await setDoc(profileRef, fallbackProfile, { merge: true })
      const profile = { id: user.uid, ...fallbackProfile, role: fallbackProfile.role, storageMode: 'firestore' }
      writeLocalProfile(user, profile)
      setUserProfile(profile)
      return profile
    } catch (error) {
      console.warn('Firestore user profile unavailable, using local role fallback.', error)
      const profile = readLocalProfile(user)
      setUserProfile(profile)
      return profile
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        setCurrentUser(user)
        if (user) {
          await loadUserProfile(user)
        } else {
          setUserProfile(null)
        }
      } finally {
        setLoading(false)
      }
    })

    return unsubscribe
  }, [])

  const value = useMemo(
    () => ({
      currentUser,
      userProfile,
      loading,
      async register({ name, phone, email, password, role }) {
        const credential = await createUserWithEmailAndPassword(auth, email, password)
        await updateProfile(credential.user, { displayName: name })
        const safeRole = normalizeRole(role)
        const profile = {
          uid: credential.user.uid,
          name,
          phone,
          email,
          role: safeRole,
          createdAt: serverTimestamp(),
        }
        const localProfile = { id: credential.user.uid, ...profile, role: safeRole, storageMode: 'local' }
        writeLocalProfile(credential.user, localProfile)

        try {
          await setDoc(doc(db, 'users', credential.user.uid), profile, { merge: true })
          setUserProfile({ id: credential.user.uid, ...profile, role: safeRole, storageMode: 'firestore' })
        } catch (error) {
          console.warn('Could not store user role in Firestore. Using local fallback until rules are updated.', error)
          setUserProfile(localProfile)
        }

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

        const profile = await loadUserProfile(credential.user)
        return { user: credential.user, profile }
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
        const profile = await loadUserProfile(auth.currentUser)
        return { user: auth.currentUser, profile }
      },
      resetPassword(email) {
        return sendPasswordResetEmail(auth, email.trim().toLowerCase(), {
          url: getAuthActionUrl('/login'),
          handleCodeInApp: false,
        })
      },
      logout() {
        return signOut(auth)
      },
    }),
    [currentUser, userProfile, loading],
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
