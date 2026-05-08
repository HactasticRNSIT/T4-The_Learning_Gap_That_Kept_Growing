import api from './api'

export async function getStudents() {
  const response = await api.get('/students')
  return response.data.students
}

export async function addStudent(studentData) {
  const response = await api.post('/students', studentData)
  return response.data.student
}

export async function submitStudentProject(studentId, projectData) {
  const response = await api.post(`/students/${studentId}/projects`, projectData)
  return response.data
}

export async function updateStudentLocation(studentId, locationData) {
  const response = await api.put(`/students/${studentId}/location`, locationData)
  return response.data
}
