import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyB5Z0XHTTbizCV_irSeXQv2Vo7V5fKl580',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'astra-learn-706cb.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'astra-learn-706cb',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'astra-learn-706cb.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '391960859686',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:391960859686:web:286c69f9451169d68242e7',
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
