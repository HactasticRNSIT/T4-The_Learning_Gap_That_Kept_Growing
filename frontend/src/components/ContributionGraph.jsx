import { CalendarDays, GitBranch, Star } from 'lucide-react'

const dayLabels = ['Mon', '', 'Wed', '', 'Fri', '', 'Sun']
const monthFormatter = new Intl.DateTimeFormat('en', { month: 'short' })
const fullDateFormatter = new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' })

function startOfDay(date) {
  const next = new Date(date)
  next.setHours(0, 0, 0, 0)
  return next
}

function formatDateKey(date) {
  return date.toISOString().slice(0, 10)
}

function getWeekStart(date) {
  const next = startOfDay(date)
  const day = next.getDay()
  const mondayOffset = day === 0 ? -6 : 1 - day
  next.setDate(next.getDate() + mondayOffset)
  return next
}

function buildWeeks(weeksToShow = 26) {
  const end = startOfDay(new Date())
  const currentWeekStart = getWeekStart(end)
  const firstWeekStart = new Date(currentWeekStart)
  firstWeekStart.setDate(firstWeekStart.getDate() - (weeksToShow - 1) * 7)

  return Array.from({ length: weeksToShow }, (_, weekIndex) =>
    Array.from({ length: 7 }, (_, dayIndex) => {
      const date = new Date(firstWeekStart)
      date.setDate(firstWeekStart.getDate() + weekIndex * 7 + dayIndex)
      return date
    }),
  )
}

function getProjectDate(project) {
  const rawDate = project.date || project.submittedAt || project.createdAt
  const parsed = rawDate ? new Date(rawDate) : null

  return parsed && !Number.isNaN(parsed.getTime()) ? parsed : null
}

function getContributionLevel(count) {
  if (count >= 4) return 'bg-emerald-300'
  if (count === 3) return 'bg-emerald-400/80'
  if (count === 2) return 'bg-emerald-500/65'
  if (count === 1) return 'bg-emerald-700/70'
  return 'bg-white/[0.08]'
}

function getCurrentStreak(contributionsByDate) {
  let streak = 0
  const cursor = startOfDay(new Date())

  while (contributionsByDate.get(formatDateKey(cursor))?.count > 0) {
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }

  return streak
}

function getBestWeek(weeks, contributionsByDate) {
  return weeks.reduce((best, week) => {
    const count = week.reduce((sum, date) => sum + (contributionsByDate.get(formatDateKey(date))?.count || 0), 0)
    return count > best ? count : best
  }, 0)
}

function ContributionGraph({ student, compact = false }) {
  if (!student) return null

  const projects = Array.isArray(student.projects) ? student.projects : []
  const storedContributions = Array.isArray(student.contributionHistory) ? student.contributionHistory : []
  const contributions = storedContributions.length
    ? storedContributions
    : projects.map((project) => ({
        ...project,
        type: 'project',
        date: project.submittedAt,
      }))
  const contributionsByDate = contributions.reduce((map, contribution) => {
    const date = getProjectDate(contribution)
    if (!date) return map

    const key = formatDateKey(startOfDay(date))
    const previous = map.get(key) || { count: 0, contributions: [] }
    map.set(key, {
      count: previous.count + 1,
      contributions: [...previous.contributions, contribution],
    })

    return map
  }, new Map())

  const weeks = buildWeeks(compact ? 18 : 26)
  const totalContributions = contributions.length
  const activeDays = contributionsByDate.size
  const currentStreak = getCurrentStreak(contributionsByDate)
  const bestWeek = getBestWeek(weeks, contributionsByDate)
  const recentContributions = contributions
    .slice()
    .sort((a, b) => (getProjectDate(b)?.getTime() || 0) - (getProjectDate(a)?.getTime() || 0))
    .slice(0, compact ? 3 : 5)

  const monthLabels = weeks.map((week, index) => {
    const firstDay = week[0]
    const previousWeek = weeks[index - 1]
    const previousMonth = previousWeek ? previousWeek[0].getMonth() : -1
    return firstDay.getMonth() !== previousMonth ? monthFormatter.format(firstDay) : ''
  })

  return (
    <section className={compact ? 'rounded-lg border border-white/10 bg-black/20 p-4' : 'glass-card'}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-2 text-emerald-100">
            <GitBranch size={20} />
            <p className="text-sm font-semibold">Contribution Graph</p>
          </div>
          <h2 className="mt-3 text-xl font-bold text-white">{student.name}'s Learning Contributions</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
            Project submissions are mapped by date, so every student sees only their own contribution history.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:min-w-[28rem]">
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
            <p className="text-xs text-slate-400">Contributions</p>
            <p className="mt-1 text-2xl font-black text-white">{totalContributions}</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
            <p className="text-xs text-slate-400">Active Days</p>
            <p className="mt-1 text-2xl font-black text-white">{activeDays}</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
            <p className="text-xs text-slate-400">Streak</p>
            <p className="mt-1 text-2xl font-black text-white">{currentStreak}</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
            <p className="text-xs text-slate-400">Best Week</p>
            <p className="mt-1 text-2xl font-black text-white">{bestWeek}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto pb-2">
        <div className="min-w-max">
          <div className="mb-2 ml-9 grid gap-1" style={{ gridTemplateColumns: `repeat(${weeks.length}, minmax(0, 1fr))` }}>
            {monthLabels.map((label, index) => (
              <span key={`${label}-${index}`} className="h-4 text-xs text-slate-500">
                {label}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-[2rem_1fr] gap-2">
            <div className="grid grid-rows-7 gap-1">
              {dayLabels.map((label, index) => (
                <span key={`${label}-${index}`} className="h-3 text-[10px] leading-3 text-slate-500">
                  {label}
                </span>
              ))}
            </div>
            <div className="grid grid-flow-col grid-rows-7 gap-1">
              {weeks.flatMap((week) =>
                week.map((date) => {
                  const key = formatDateKey(date)
                  const contribution = contributionsByDate.get(key)
                  const count = contribution?.count || 0
                  const title = `${count} contribution${count === 1 ? '' : 's'} on ${fullDateFormatter.format(date)}`

                  return (
                    <span
                      key={key}
                      className={`h-3 w-3 rounded-sm ${getContributionLevel(count)} ring-1 ring-white/5`}
                      title={title}
                      aria-label={title}
                    />
                  )
                }),
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-400">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((count) => (
          <span key={count} className={`h-3 w-3 rounded-sm ${getContributionLevel(count)} ring-1 ring-white/5`} />
        ))}
        <span>More</span>
      </div>

      {recentContributions.length > 0 ? (
        <div className="mt-6 grid gap-3">
          {recentContributions.map((contribution) => {
            const date = getProjectDate(contribution)
            return (
              <article key={contribution.id || `${contribution.title}-${contribution.date}`} className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-bold text-white">{contribution.title}</p>
                    <p className="mt-1 text-sm text-slate-400">{contribution.type === 'project' ? 'Project contribution' : 'Learning contribution'}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs font-semibold">
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-300/15 px-3 py-1 text-amber-100">
                      <Star size={13} />
                      +{Number(contribution.pointsAwarded || 0)}
                    </span>
                    {date && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-slate-200">
                        <CalendarDays size={13} />
                        {fullDateFormatter.format(date)}
                      </span>
                    )}
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      ) : (
        <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.04] p-4 text-sm leading-6 text-slate-300">
          No project contributions yet. Submit a project from the Projects page to light up the graph.
        </div>
      )}
    </section>
  )
}

export default ContributionGraph
