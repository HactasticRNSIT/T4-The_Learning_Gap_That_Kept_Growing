import { normalizeRisk } from './risk'

const subjects = [
  { key: 'mathScore', label: 'Math', concepts: ['Fractions', 'Algebra fundamentals', 'Word problems'] },
  { key: 'physicsScore', label: 'Physics', concepts: ['Motion', 'Forces', 'Numerical reasoning'] },
  { key: 'chemistryScore', label: 'Chemistry', concepts: ['Atomic structure', 'Equations', 'Periodic trends'] },
]

export function average(values) {
  const cleanValues = values.map((value) => Number(value || 0)).filter((value) => Number.isFinite(value))
  if (!cleanValues.length) return 0
  return Math.round(cleanValues.reduce((sum, value) => sum + value, 0) / cleanValues.length)
}

export function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(value)))
}

export function getSubjectAverage(student) {
  return average(subjects.map((subject) => student[subject.key]))
}

export function getWeakSubjects(student) {
  return subjects
    .map((subject) => ({ ...subject, score: Number(student[subject.key] || 0) }))
    .sort((a, b) => a.score - b.score)
}

export function buildStudentProfile(student) {
  const scoreAverage = getSubjectAverage(student)
  const attendance = Number(student.attendance || 0)
  const risk = normalizeRisk(student.riskLevel)
  const weakSubjects = getWeakSubjects(student)
  const weakest = weakSubjects[0]
  const secondWeakest = weakSubjects[1]
  const riskScore = clamp((100 - scoreAverage) * 0.56 + (100 - attendance) * 0.34 + (risk === 'High' ? 18 : risk === 'Moderate' ? 8 : 0))
  const disengagement = clamp((100 - attendance) * 0.55 + (100 - scoreAverage) * 0.28 + (student.remarks?.length ? 8 : 3))
  const dropout = clamp(riskScore * 0.52 + (100 - attendance) * 0.32)
  const failure = clamp((100 - weakest.score) * 0.78 + (attendance < 75 ? 14 : 4))
  const interventionSuccess = clamp(100 - riskScore * 0.42 + attendance * 0.24 + (scoreAverage > 60 ? 10 : 3))
  const mastery = subjects.map((subject) => ({
    subject: subject.label,
    score: Number(student[subject.key] || 0),
    mastery: clamp(Number(student[subject.key] || 0)),
    concept: subject.concepts[Number(student[subject.key] || 0) < 55 ? 1 : 2],
  }))

  const reasons = [
    attendance < 75 ? `attendance is ${attendance}%` : `attendance is steady at ${attendance}%`,
    `${weakest.label} is the weakest score at ${weakest.score}%`,
    risk === 'High' ? 'current AI risk label is High' : `current AI risk label is ${risk}`,
  ]

  return {
    ...student,
    average: scoreAverage,
    risk,
    riskScore,
    disengagement,
    dropout,
    failure,
    interventionSuccess,
    weakest,
    secondWeakest,
    mastery,
    reasons,
    learningStyle: weakest.label === 'Math' ? 'visual learner with structured practice needs' : 'guided problem solver with retrieval practice needs',
    retention: attendance > 85 ? 'high consistency' : attendance > 75 ? 'uneven retention' : 'fragile retention pattern',
    confidence: clamp(scoreAverage * 0.55 + attendance * 0.25 + (risk === 'Safe' ? 16 : 4)),
    growthScore: clamp(45 + interventionSuccess * 0.42 - riskScore * 0.16),
    trajectory: [
      { week: 'W1', score: clamp(scoreAverage - 8) },
      { week: 'W2', score: clamp(scoreAverage - 5) },
      { week: 'W3', score: clamp(scoreAverage - (risk === 'High' ? 7 : 1)) },
      { week: 'W4', score: clamp(scoreAverage) },
      { week: 'Plan', score: clamp(scoreAverage + interventionSuccess * 0.14) },
    ],
  }
}

export function buildCohortIntelligence(students) {
  const workingStudents = students.map(buildStudentProfile)
  const riskCounts = workingStudents.reduce(
    (counts, student) => ({ ...counts, [student.risk]: (counts[student.risk] || 0) + 1 }),
    { High: 0, Moderate: 0, Safe: 0 },
  )
  const subjectAverages = subjects.map((subject) => ({
    subject: subject.label,
    average: average(workingStudents.map((student) => student[subject.key])),
  }))
  const heatmap = workingStudents.flatMap((student) =>
    subjects.map((subject) => ({
      student: student.name.split(' ')[0],
      subject: subject.label,
      value: Number(student[subject.key] || 0),
    })),
  )
  const highRisk = workingStudents.filter((student) => student.risk === 'High')
  const urgent = workingStudents.slice().sort((a, b) => b.riskScore - a.riskScore)

  return {
    students: workingStudents,
    riskCounts,
    subjectAverages,
    heatmap,
    urgent,
    highRisk,
    schoolAverage: average(workingStudents.map((student) => student.average)),
    attendanceAverage: average(workingStudents.map((student) => student.attendance)),
    interventionSuccess: average(workingStudents.map((student) => student.interventionSuccess)),
    gapTrend: workingStudents.length
      ? subjectAverages.slice().sort((a, b) => a.average - b.average)[0]
      : { subject: 'No data', average: 0 },
  }
}

export function findStudentForUser(students, userProfile, currentUser) {
  const profileName = userProfile?.name?.trim().toLowerCase()
  const displayName = currentUser?.displayName?.trim().toLowerCase()
  const email = currentUser?.email?.trim().toLowerCase()

  return students.find((student) => {
    const studentName = student.name?.trim().toLowerCase()
    const studentEmail = student.email?.trim().toLowerCase()
    return (profileName && studentName === profileName) || (displayName && studentName === displayName) || (email && studentEmail === email)
  })
}

export function findChildrenForUser(students, userProfile, currentUser) {
  const email = currentUser?.email?.trim().toLowerCase()
  const profileEmail = userProfile?.email?.trim().toLowerCase()

  return students.filter((student) => {
    const parentEmail = student.parentEmail?.trim().toLowerCase()
    return parentEmail && (parentEmail === email || parentEmail === profileEmail)
  })
}
