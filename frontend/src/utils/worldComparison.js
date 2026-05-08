import { buildStudentProfile, clamp } from './academicIntelligence'

export function buildWorldComparison(studentRecord) {
  const student = buildStudentProfile(studentRecord)
  const starPoints = Number(student.starPoints || 0)
  const projectBoost = Math.min(18, starPoints / 8)
  const globalIndex = clamp(student.average * 0.62 + student.attendance * 0.16 + student.confidence * 0.1 + projectBoost)
  const percentile = clamp(globalIndex)
  const projectRank = starPoints >= 120 ? 'Global Builder' : starPoints >= 60 ? 'Rising Builder' : starPoints >= 25 ? 'Active Explorer' : 'Starter'
  const benchmark =
    percentile >= 85
      ? 'Ahead of global school benchmark'
      : percentile >= 65
        ? 'Near global school benchmark'
        : 'Needs focused practice to reach global benchmark'

  return {
    student,
    percentile,
    starPoints,
    projectRank,
    benchmark,
    nextTarget: starPoints < 25 ? 'Upload 2 projects' : starPoints < 60 ? 'Reach 60 star points' : 'Build an advanced portfolio project',
  }
}
