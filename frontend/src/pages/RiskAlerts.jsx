import { AlertTriangle } from 'lucide-react'
import EmptyState from '../components/EmptyState'
import PageHeader from '../components/PageHeader'
import { normalizeRisk } from '../components/StatusBadge'
import { useStudents } from '../hooks/useStudents'

function RiskAlerts() {
  const { students, loading, error } = useStudents()
  const highRiskStudents = students.filter((student) => normalizeRisk(student.riskLevel) === 'High')

  return (
    <>
      <PageHeader
        eyebrow="Priority queue"
        title="Risk Alerts"
        description="Only high risk students appear here so teachers can prioritize immediate intervention."
      />

      {error && <div className="mb-6 rounded-lg border border-rose-300/20 bg-rose-400/10 p-4 text-rose-100">{error}</div>}

      {highRiskStudents.length === 0 && !loading ? (
        <EmptyState title="No high risk alerts" description="Students classified as High risk by the AI engine will appear here." />
      ) : (
        <div className="grid gap-5 xl:grid-cols-2">
          {(loading ? Array.from({ length: 2 }) : highRiskStudents).map((student, index) => (
            <article key={student?.id || index} className="rounded-lg border border-rose-300/25 bg-rose-400/10 p-5 backdrop-blur-xl">
              {loading ? (
                <div className="h-32 animate-pulse rounded bg-white/10" />
              ) : (
                <>
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-black text-white">{student.name}</h2>
                      <p className="mt-1 text-sm text-rose-100">Grade {student.grade} · Attendance {student.attendance}%</p>
                    </div>
                    <AlertTriangle className="text-rose-200" size={28} />
                  </div>
                  <p className="text-sm font-semibold text-rose-100">Immediate Intervention Required</p>
                  <p className="mt-3 text-sm leading-6 text-slate-200">{student.learningGap}</p>
                  <p className="mt-4 rounded-lg border border-white/10 bg-black/20 p-4 text-sm leading-6 text-slate-200">
                    {student.recommendation}
                  </p>
                </>
              )}
            </article>
          ))}
        </div>
      )}
    </>
  )
}

export default RiskAlerts
