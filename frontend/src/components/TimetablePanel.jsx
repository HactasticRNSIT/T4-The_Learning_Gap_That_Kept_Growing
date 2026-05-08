import { CalendarClock, ExternalLink } from 'lucide-react'
import { buildOptimizedTimetable } from '../utils/timetable'

function TimetablePanel({ student, compact = false }) {
  if (!student) return null

  const timetable = buildOptimizedTimetable(student)
  const visibleDays = compact ? timetable.days.slice(0, 3) : timetable.days

  return (
    <section className={compact ? 'rounded-lg border border-white/10 bg-black/20 p-4' : 'glass-card'}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-amber-100">
            <CalendarClock size={20} />
            <p className="text-sm font-semibold">Optimized Timetable</p>
          </div>
          <h2 className="mt-3 text-xl font-bold text-white">{timetable.recommendedSlot}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            {timetable.reason} Weekly study load: {timetable.weeklyMinutes} minutes.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        {visibleDays.map((item) => (
          <article key={item.day} className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-bold text-white">{item.day}</p>
                <p className="mt-1 text-sm text-cyan-100">{item.focus} - {item.duration} min</p>
              </div>
              {item.reference.url && (
                <a
                  href={item.reference.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-amber-100 hover:text-amber-50"
                >
                  Reference
                  <ExternalLink size={14} />
                </a>
              )}
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-300">{item.task}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default TimetablePanel
