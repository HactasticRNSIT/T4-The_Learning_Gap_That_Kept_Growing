import { CalendarDays, GitBranch, Star } from 'lucide-react'

const dateFormatter = new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' })

function getContributionDate(contribution) {
  const rawDate = contribution?.date || contribution?.submittedAt || contribution?.createdAt
  const parsed = rawDate ? new Date(rawDate) : null
  return parsed && !Number.isNaN(parsed.getTime()) ? parsed : null
}

function getStudentContributions(student) {
  const history = Array.isArray(student.contributionHistory) ? student.contributionHistory : []
  if (history.length) return history

  return Array.isArray(student.projects)
    ? student.projects.map((project) => ({
        ...project,
        type: 'project',
        date: project.submittedAt,
      }))
    : []
}

export function getContributionStats(student) {
  const contributions = getStudentContributions(student)
  const sorted = contributions
    .slice()
    .sort((a, b) => (getContributionDate(b)?.getTime() || 0) - (getContributionDate(a)?.getTime() || 0))

  return {
    contributions,
    total: contributions.length,
    lastContribution: sorted[0] || null,
    lastContributionDate: sorted[0] ? getContributionDate(sorted[0]) : null,
  }
}

function StudentActivityFeed({ students, compact = false }) {
  const updates = students
    .flatMap((student) =>
      getStudentContributions(student).map((contribution) => ({
        ...contribution,
        studentId: student.id,
        studentName: student.name,
        dateObject: getContributionDate(contribution),
      })),
    )
    .filter((item) => item.dateObject)
    .sort((a, b) => b.dateObject.getTime() - a.dateObject.getTime())
    .slice(0, compact ? 4 : 8)

  return (
    <section className={compact ? 'rounded-lg border border-white/10 bg-black/20 p-4' : 'glass-card'}>
      <div className="flex items-center gap-2 text-emerald-100">
        <GitBranch size={20} />
        <p className="text-sm font-semibold">Student Activity Updates</p>
      </div>
      <h2 className="mt-3 text-xl font-bold text-white">Recent Contributions</h2>
      <p className="mt-2 text-sm leading-6 text-slate-300">
        Project uploads from linked students appear here automatically for their teacher and parent views.
      </p>

      {updates.length ? (
        <div className="mt-5 grid gap-3">
          {updates.map((update) => (
            <article key={`${update.studentId}-${update.id || update.projectId || update.date}`} className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-bold text-white">{update.studentName}</p>
                  <p className="mt-1 text-sm text-slate-300">{update.title || 'Project contribution'}</p>
                </div>
                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-300/15 px-3 py-1 text-amber-100">
                    <Star size={13} />
                    +{Number(update.pointsAwarded || 0)}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-slate-200">
                    <CalendarDays size={13} />
                    {dateFormatter.format(update.dateObject)}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-lg border border-white/10 bg-white/[0.04] p-4 text-sm leading-6 text-slate-300">
          No student project updates yet.
        </div>
      )}
    </section>
  )
}

export default StudentActivityFeed
