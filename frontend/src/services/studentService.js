import api from './api'

export async function getStudents() {
  const response = await api.get('/students')
  return response.data.students
}

export async function addStudent(studentData) {
  const response = await api.post('/students', studentData)
  return response.data.student
}
