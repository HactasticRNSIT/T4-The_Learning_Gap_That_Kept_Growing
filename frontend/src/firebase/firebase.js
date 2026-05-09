import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyAPwIRgJx7MBxmZ4X3N3eZ26C3rvGi8vSA",
  authDomain: "astra-learn-4fc01.firebaseapp.com",
  projectId: "astra-learn-4fc01",
  storageBucket: "astra-learn-4fc01.firebasestorage.app",
  messagingSenderId: "629150572513",
  appId: "1:629150572513:web:bbb0445f2ee4085b8bbca0"
};

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
