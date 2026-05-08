import EmptyState from '../components/EmptyState'
import PageHeader from '../components/PageHeader'
import StatusBadge from '../components/StatusBadge'
import { useStudents } from '../hooks/useStudents'

function LearningGaps() {
  const { students, loading, error } = useStudents()

  return (
    <>
      <PageHeader
        title="Learning Gaps"
        description="Weak concepts paired with personalized interventions, designed for quick teacher action."
      />

      {error && <div className="mb-6 rounded-lg border border-rose-300/20 bg-rose-400/10 p-4 text-rose-100">{error}</div>}

      {students.length === 0 && !loading ? (
        <EmptyState title="No learning gaps detected yet" />
      ) : (
        <div className="space-y-4">
          {(loading ? Array.from({ length: 5 }) : students).map((student, index) => (
            <article key={student?.id || index} className="glass-card">
              {loading ? (
                <div className="h-20 animate-pulse rounded bg-white/10" />
              ) : (
                <div className="grid gap-4 lg:grid-cols-[1fr_1.5fr_1.5fr] lg:items-start">
                  <div>
                    <div className="mb-3">
                      <StatusBadge riskLevel={student.riskLevel} />
                    </div>
                    <h2 className="text-xl font-bold">{student.name}</h2>
                    <p className="text-sm text-slate-400">Attendance {student.attendance}%</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-cyan-100">Weak Concepts</p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{student.learningGap}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-emerald-100">Personalized Intervention</p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{student.recommendation}</p>
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </>
  )
}

export default LearningGaps
