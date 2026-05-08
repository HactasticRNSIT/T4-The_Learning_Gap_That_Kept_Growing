export const roles = {
  teacher: {
    label: 'Teacher',
    path: '/teacher',
    description: 'Classroom intelligence, interventions, prediction, and academic copilot.',
  },
  student: {
    label: 'Student',
    path: '/student',
    description: 'Study coach, mastery map, recovery plan, motivation, and career guidance.',
  },
  parent: {
    label: 'Parent',
    path: '/parent',
    description: 'Child progress, risk alerts, attendance patterns, and parent guidance.',
  },
  admin: {
    label: 'School Admin',
    path: '/admin',
    description: 'School-wide analytics, departments, teacher effectiveness, and trends.',
  },
}

export function normalizeRole(role) {
  return roles[role] ? role : 'teacher'
}

export function getPortalPath(role) {
  return roles[normalizeRole(role)].path
}
