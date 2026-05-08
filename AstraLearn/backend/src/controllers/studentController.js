import db from '../config/firebaseAdmin.js'
import {
  analyzeStudentWithAI
} from '../services/aiService.js'

export const getStudents = async (req, res) => {

  try {

    const snapshot =
      await db.collection('students').get()

    const students = snapshot.docs.map(doc => ({

      id: doc.id,
      ...doc.data()

    }))

    res.json(students)

  } catch (error) {

    res.status(500).json({

      message: error.message

    })

  }

}

export const addStudent = async (req, res) => {

  try {

    const {

      name,
      grade,
      attendance,
      mathScore,
      physicsScore,
      chemistryScore,
      remarks

    } = req.body

   const aiAnalysis =
  await analyzeStudentWithAI({

    name,
    grade,
    attendance,
    mathScore,
    physicsScore,
    chemistryScore,
    remarks

  })

const riskLevel =
  aiAnalysis.riskLevel

const learningGap =
  aiAnalysis.learningGap

const recommendation =
  aiAnalysis.recommendation

    const newStudent = {

      name,
      grade,
      attendance,
      mathScore,
      physicsScore,
      chemistryScore,
      remarks,

      riskLevel,
      learningGap,
      recommendation,

      createdAt:
        new Date().toISOString()

    }

    const docRef =
      await db.collection('students')
      .add(newStudent)

    res.status(201).json({

      id: docRef.id,
      ...newStudent

    })

  } catch (error) {

    res.status(500).json({

      message: error.message

    })

  }

}