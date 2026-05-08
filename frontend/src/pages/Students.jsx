import EmptyState from '../components/EmptyState'
import PageHeader from '../components/PageHeader'
import StatusBadge from '../components/StatusBadge'
import { useStudents } from '../hooks/useStudents'

function Students() {
  const { students, loading, error } = useStudents()

  return (
    <>
      <PageHeader
        title="Students"
        description="Every row is stored in Firestore after backend AI analysis enriches the record."
      />

      {error && <div className="mb-6 rounded-lg border border-rose-300/20 bg-rose-400/10 p-4 text-rose-100">{error}</div>}

      <section className="glass-card overflow-hidden p-0">
        {students.length === 0 && !loading ? (
          <EmptyState />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="border-b border-white/10 bg-white/[0.04] text-xs uppercase tracking-[0.2em] text-slate-400">
                <tr>
                  <th className="px-5 py-4">Name</th>
                  <th className="px-5 py-4">Grade</th>
                  <th className="px-5 py-4">Attendance</th>
                  <th className="px-5 py-4">Risk Level</th>
                  <th className="px-5 py-4">Learning Gap</th>
                  <th className="px-5 py-4">Recommendation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {loading
                  ? Array.from({ length: 4 }).map((_, index) => (
                      <tr key={index}>
                        <td className="px-5 py-5" colSpan={6}>
                          <div className="h-5 animate-pulse rounded bg-white/10" />
                        </td>
                      </tr>
                    ))
                  : students.map((student) => (
                      <tr key={student.id} className="align-top transition hover:bg-white/[0.03]">
                        <td className="px-5 py-4 font-semibold text-white">{student.name}</td>
                        <td className="px-5 py-4 text-slate-300">{student.grade}</td>
                        <td className="px-5 py-4 text-slate-300">{student.attendance}%</td>
                        <td className="px-5 py-4">
                          <StatusBadge riskLevel={student.riskLevel} />
                        </td>
                        <td className="max-w-xs px-5 py-4 text-slate-300">{student.learningGap}</td>
                        <td className="max-w-sm px-5 py-4 text-slate-400">{student.recommendation}</td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  )
}

export default Students
