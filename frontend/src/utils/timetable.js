import { buildStudentProfile } from './academicIntelligence'

const subjectAccent = {
  Math: 'Algebra drill + worked examples',
  Physics: 'Formula review + numerical practice',
  Chemistry: 'Concept map + equation practice',
}

function priorityMinutes(student) {
  if (student.risk === 'High') return 55
  if (student.risk === 'Moderate') return 45
  return 35
}

function supportMinutes(student) {
  return student.attendance < 75 ? 25 : 20
}

export function buildOptimizedTimetable(studentRecord) {
  const student = buildStudentProfile(studentRecord)
  const mainMinutes = priorityMinutes(student)
  const secondMinutes = supportMinutes(student)
  const lightMinutes = student.risk === 'Safe' ? 20 : 25
  const resource = Array.isArray(student.resources) ? student.resources.find((item) => item?.url) : null
  const reference = resource
    ? { title: resource.title || 'Reference resource', url: resource.url }
    : { title: `${student.weakest.label} reference practice`, url: '' }

  const days = [
    {
      day: 'Monday',
      focus: student.weakest.label,
      duration: mainMinutes,
      task: subjectAccent[student.weakest.label] || 'Core concept revision',
      reference,
    },
    {
      day: 'Tuesday',
      focus: student.secondWeakest.label,
      duration: secondMinutes,
      task: subjectAccent[student.secondWeakest.label] || 'Guided practice',
      reference,
    },
    {
      day: 'Wednesday',
      focus: student.weakest.label,
      duration: mainMinutes,
      task: `Micro-quiz on ${student.weakest.concepts[1]}`,
      reference,
    },
    {
      day: 'Thursday',
      focus: 'Mixed Practice',
      duration: lightMinutes,
      task: `${student.weakest.label} and ${student.secondWeakest.label} error correction`,
      reference,
    },
    {
      day: 'Friday',
      focus: student.weakest.label,
      duration: mainMinutes,
      task: 'Timed practice and teacher doubt list',
      reference,
    },
    {
      day: 'Saturday',
      focus: 'Weekly Review',
      duration: 30,
      task: 'Revise mistakes, update confidence, and retake weak questions',
      reference,
    },
  ]

  return {
    student,
    recommendedSlot: student.attendance < 75 ? '6:30 PM - 7:30 PM' : '5:30 PM - 6:30 PM',
    weeklyMinutes: days.reduce((sum, item) => sum + item.duration, 0),
    reason:
      student.attendance < 75
        ? `Attendance is ${student.attendance}%, so the plan uses shorter daily recovery blocks with review repetition.`
        : `${student.weakest.label} is the weakest score at ${student.weakest.score}%, so the plan gives it the highest practice time.`,
    days,
  }
}
