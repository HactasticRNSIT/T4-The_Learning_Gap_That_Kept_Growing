// src/firebase/firebase.js

import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyB5Z0XHTTbizCV_irSeXQv2Vo7V5fKl580",
  authDomain: "astra-learn-706cb.firebaseapp.com",
  projectId: "astra-learn-706cb",
  storageBucket: "astra-learn-706cb.firebasestorage.app",
  messagingSenderId: "391960859686",
  appId: "1:391960859686:web:286c69f9451169d68242e7"
};

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)