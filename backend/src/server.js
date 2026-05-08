import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import studentRoutes from './routes/studentRoutes.js'

dotenv.config()

const app = express()
const allowedOrigins = (
  process.env.CORS_ORIGIN || 'http://localhost:5173,http://127.0.0.1:5173,http://localhost:5174,http://127.0.0.1:5174'
)
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true)
      }

      return callback(new Error('Not allowed by CORS'))
    },
  }),
)
app.use(express.json({ limit: '1mb' }))

app.get('/', (req, res) => {
  res.json({ service: 'AstraLearn Backend', status: 'running' })
})

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use('/api/students', studentRoutes)

app.use((req, res) => {
  res.status(404).json({ message: 'API route not found' })
})

app.use((error, req, res, next) => {
  console.error(error)
  res.status(500).json({ message: error.message || 'Unexpected server error' })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`AstraLearn backend running on port ${PORT}`)
})
