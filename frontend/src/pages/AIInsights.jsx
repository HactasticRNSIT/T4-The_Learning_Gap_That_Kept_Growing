import EmptyState from '../components/EmptyState'
import PageHeader from '../components/PageHeader'
import StatusBadge from '../components/StatusBadge'
import { useStudents } from '../hooks/useStudents'

function AIInsights() {
  const { students, loading, error } = useStudents()

  return (
    <>
      <PageHeader
        title="AI Insights"
        description="Sarvam AI output rendered as intervention-ready intelligence cards for each student."
      />

      {error && <div className="mb-6 rounded-lg border border-rose-300/20 bg-rose-400/10 p-4 text-rose-100">{error}</div>}

      {students.length === 0 && !loading ? (
        <EmptyState title="No AI insights yet" />
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {(loading ? Array.from({ length: 4 }) : students).map((student, index) => (
            <article key={student?.id || index} className="glass-card">
              {loading ? (
                <div className="space-y-4">
                  <div className="h-5 w-1/3 animate-pulse rounded bg-white/10" />
                  <div className="h-20 animate-pulse rounded bg-white/10" />
                </div>
              ) : (
                <>
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-white">{student.name}</h2>
                      <p className="text-sm text-slate-400">Grade {student.grade}</p>
                    </div>
                    <StatusBadge riskLevel={student.riskLevel} />
                  </div>
                  <div className="space-y-4 text-sm leading-6">
                    <div>
                      <p className="font-semibold text-cyan-100">Learning Gap</p>
                      <p className="mt-1 text-slate-300">{student.learningGap}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-emerald-100">Recommendation</p>
                      <p className="mt-1 text-slate-300">{student.recommendation}</p>
                    </div>
                  </div>
                </>
              )}
            </article>
          ))}
        </div>
      )}
    </>
  )
}

export default AIInsights
