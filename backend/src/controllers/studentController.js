import db, { admin } from '../config/firebaseAdmin.js'
import { analyzeStudentWithAI } from '../services/aiService.js'
import { findCompanyRecommendations, findLearningResources, findStudentOpportunities } from '../services/tavilyService.js'

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
    projects: Array.isArray(data.projects) ? data.projects : [],
    contributionHistory: Array.isArray(data.contributionHistory) ? data.contributionHistory : [],
    starPoints: Number(data.starPoints || 0),
    createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
  }
}

function calculateProjectPoints(project) {
  let points = 10

  if (project.projectUrl) points += 5
  if (project.description.length >= 80) points += 10
  if (project.subject) points += 5

  return Math.min(points, 30)
}

async function serializeStudentWithEnhancements(doc) {
  const student = serializeStudent(doc)
  const updates = {}
  let resources = student.resources
  let opportunities = student.opportunities
  let companyRecommendations = student.companyRecommendations

  if (!Array.isArray(resources) || !resources.length) {
    resources = await findLearningResources(student, {
      learningGap: student.learningGap,
      recommendation: student.recommendation,
    })
    updates.resources = resources
  }

  if (!Array.isArray(opportunities) || !opportunities.length) {
    opportunities = await findStudentOpportunities(student, {
      learningGap: student.learningGap,
      recommendation: student.recommendation,
    })
    updates.opportunities = opportunities
  }

  if (!Array.isArray(companyRecommendations) || !companyRecommendations.length) {
    companyRecommendations = await findCompanyRecommendations(student, {
      learningGap: student.learningGap,
      recommendation: student.recommendation,
    })
    updates.companyRecommendations = companyRecommendations
  }

  if (Object.keys(updates).length) {
    await doc.ref.update(updates)
  }

  return { ...student, resources, opportunities, companyRecommendations }
}

export async function getStudents(req, res) {
  try {
    const snapshot = await db.collection('students').orderBy('createdAt', 'desc').get()
    const students = await Promise.all(snapshot.docs.map(serializeStudentWithEnhancements))

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
      email: req.body.email ? String(req.body.email).trim().toLowerCase() : '',
      parentEmail: req.body.parentEmail ? String(req.body.parentEmail).trim().toLowerCase() : '',
      teacherEmail: req.body.teacherEmail ? String(req.body.teacherEmail).trim().toLowerCase() : '',
      teacherName: req.body.teacherName ? String(req.body.teacherName).trim() : '',
      grade: String(req.body.grade).trim(),
      attendance: Number(req.body.attendance),
      mathScore: Number(req.body.mathScore),
      physicsScore: Number(req.body.physicsScore),
      chemistryScore: Number(req.body.chemistryScore),
      remarks: String(req.body.remarks).trim(),
    }

    const aiAnalysis = await analyzeStudentWithAI(studentInput)
    const resources = await findLearningResources(studentInput, aiAnalysis)
    const opportunities = await findStudentOpportunities(studentInput, aiAnalysis)
    const companyRecommendations = await findCompanyRecommendations(studentInput, aiAnalysis)

    const newStudent = {
      ...studentInput,
      riskLevel: aiAnalysis.riskLevel,
      learningGap: aiAnalysis.learningGap,
      recommendation: aiAnalysis.recommendation,
      resources,
      opportunities,
      companyRecommendations,
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

export async function submitStudentProject(req, res) {
  try {
    const docRef = db.collection('students').doc(req.params.id)
    const snapshot = await docRef.get()

    if (!snapshot.exists) {
      return res.status(404).json({ message: 'Student not found.' })
    }

    const title = String(req.body.title || '').trim()
    const description = String(req.body.description || '').trim()
    const subject = String(req.body.subject || '').trim()
    const projectUrl = String(req.body.projectUrl || '').trim()

    if (!title) {
      return res.status(400).json({ message: 'Project title is required.' })
    }

    if (!description) {
      return res.status(400).json({ message: 'Project description is required.' })
    }

    const project = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      title,
      description,
      subject,
      projectUrl,
      pointsAwarded: calculateProjectPoints({ title, description, subject, projectUrl }),
      submittedAt: new Date().toISOString(),
    }
    const contribution = {
      id: `project-${project.id}`,
      type: 'project',
      title,
      pointsAwarded: project.pointsAwarded,
      date: project.submittedAt,
      day: project.submittedAt.slice(0, 10),
      projectId: project.id,
    }

    await docRef.update({
      projects: admin.firestore.FieldValue.arrayUnion(project),
      contributionHistory: admin.firestore.FieldValue.arrayUnion(contribution),
      starPoints: admin.firestore.FieldValue.increment(project.pointsAwarded),
    })

    const updatedDoc = await docRef.get()
    const student = await serializeStudentWithEnhancements(updatedDoc)

    res.status(201).json({ student, project })
  } catch (error) {
    console.error('Failed to submit student project:', error)
    res.status(500).json({ message: 'Unable to submit project right now.' })
  }
}

export async function updateStudentLocation(req, res) {
  try {
    const docRef = db.collection('students').doc(req.params.id)
    const snapshot = await docRef.get()

    if (!snapshot.exists) {
      return res.status(404).json({ message: 'Student not found.' })
    }

    const latitude = Number(req.body.latitude)
    const longitude = Number(req.body.longitude)

    if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
      return res.status(400).json({ message: 'Latitude must be a valid number between -90 and 90.' })
    }

    if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
      return res.status(400).json({ message: 'Longitude must be a valid number between -180 and 180.' })
    }

    const location = {
      latitude,
      longitude,
      accuracy: Number.isFinite(Number(req.body.accuracy)) ? Number(req.body.accuracy) : null,
      label: String(req.body.label || '').trim(),
      source: 'browser',
      updatedAt: new Date().toISOString(),
    }
    const baseStudent = serializeStudent(snapshot)
    const opportunities = await findStudentOpportunities({ ...baseStudent, location }, {
      learningGap: baseStudent.learningGap,
      recommendation: baseStudent.recommendation,
    })

    await docRef.update({
      location,
      opportunities,
      opportunitiesUpdatedAt: admin.firestore.FieldValue.serverTimestamp(),
    })

    const updatedDoc = await docRef.get()
    const student = await serializeStudentWithEnhancements(updatedDoc)

    res.json({ student, opportunities })
  } catch (error) {
    console.error('Failed to update student location:', error)
    res.status(500).json({ message: 'Unable to save location right now.' })
  }
}
