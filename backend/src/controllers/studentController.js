import db, { admin } from '../config/firebaseAdmin.js'
import { analyzeStudentWithAI } from '../services/aiService.js'

const requiredFields = ['name', 'grade', 'attendance', 'mathScore', 'physicsScore', 'chemistryScore', 'remarks']

function validateStudent(payload) {
  const missing = requiredFields.filter((field) => payload[field] === undefined || payload[field] === '')

  if (missing.length) {
    return `Missing required fields: ${missing.join(', ')}`
  }

  const numericFields = ['attendance', 'mathScore', 'physicsScore', 'chemistryScore']
  const invalidNumber = numericFields.find((field) => {
    const value = Number(payload[field])
    return Number.isNaN(value) || value < 0 || value > 100
  })

  if (invalidNumber) {
    return `${invalidNumber} must be a number between 0 and 100`
  }

  return ''
}

function serializeStudent(doc) {
  const data = doc.data()

  return {
    id: doc.id,
    ...data,
    createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
  }
}

export async function getStudents(req, res) {
  try {
    const snapshot = await db.collection('students').orderBy('createdAt', 'desc').get()
    const students = snapshot.docs.map(serializeStudent)

    res.json({ students })
  } catch (error) {
    console.error('Failed to fetch students:', error)
    res.status(500).json({ message: 'Unable to fetch students right now.' })
  }
}

export async function addStudent(req, res) {
  try {
    const validationError = validateStudent(req.body)

    if (validationError) {
      return res.status(400).json({ message: validationError })
    }

    const studentInput = {
      name: String(req.body.name).trim(),
      grade: String(req.body.grade).trim(),
      attendance: Number(req.body.attendance),
      mathScore: Number(req.body.mathScore),
      physicsScore: Number(req.body.physicsScore),
      chemistryScore: Number(req.body.chemistryScore),
      remarks: String(req.body.remarks).trim(),
    }

    const aiAnalysis = await analyzeStudentWithAI(studentInput)

    const newStudent = {
      ...studentInput,
      riskLevel: aiAnalysis.riskLevel,
      learningGap: aiAnalysis.learningGap,
      recommendation: aiAnalysis.recommendation,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    }

    const docRef = await db.collection('students').add(newStudent)
    const savedDoc = await docRef.get()

    res.status(201).json({ student: serializeStudent(savedDoc) })
  } catch (error) {
    console.error('Failed to add student:', error)
    res.status(500).json({ message: 'Unable to analyze and save student right now.' })
  }
}
