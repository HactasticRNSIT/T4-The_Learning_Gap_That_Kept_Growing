import express from 'express'
import { addStudent, getStudents, submitStudentProject, updateStudentLocation } from '../controllers/studentController.js'

const router = express.Router()

router.get('/', getStudents)
router.post('/', addStudent)
router.put('/:id/location', updateStudentLocation)
router.post('/:id/projects', submitStudentProject)

export default router
