// src/services/studentService.js

import axios from 'axios'

const API = 'http://localhost:5000/api/students'

export const addStudent = async (studentData) => {

  const response = await axios.post(
    API,
    studentData
  )

  return response.data

}

export const getStudents = async () => {

  const response = await axios.get(API)

  return response.data

}