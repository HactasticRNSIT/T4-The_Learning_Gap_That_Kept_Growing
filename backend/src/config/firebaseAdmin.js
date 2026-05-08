import admin from 'firebase-admin'
import fs from 'fs'

function loadCredential() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    return admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
  }

  if (
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY
  ) {
    return admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    })
  }

  const serviceAccountPath = new URL('../serviceAccountKey.json', import.meta.url)

  if (fs.existsSync(serviceAccountPath)) {
    return admin.credential.cert(JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8')))
  }

  return admin.credential.applicationDefault()
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: loadCredential(),
  })
}

const db = admin.firestore()

export { admin }
export default db
