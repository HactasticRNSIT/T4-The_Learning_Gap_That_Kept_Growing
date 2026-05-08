import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Download, GitBranch, PlusCircle, Search, Star } from 'lucide-react'
import EmptyState from '../components/EmptyState'
import PageHeader from '../components/PageHeader'
import StatusBadge from '../components/StatusBadge'
import { getContributionStats } from '../components/StudentActivityFeed'
import { useAuth } from '../hooks/useAuth'
import { useStudents } from '../hooks/useStudents'
import { downloadStudentReport } from '../utils/reportCard'

function Students() {
  const { students, loading, error } = useStudents()
  const { currentUser } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const teacherEmail = currentUser?.email?.trim().toLowerCase()
  const teacherStudents = useMemo(
    () => students.filter((student) => !student.teacherEmail || student.teacherEmail === teacherEmail),
    [students, teacherEmail],
  )
  const filteredStudents = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    if (!query) return teacherStudents

    return teacherStudents.filter((student) =>
      [student.name, student.grade, student.email, student.parentEmail, student.riskLevel, student.learningGap, student.starPoints, getContributionStats(student).total]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query)),
    )
  }, [searchTerm, teacherStudents])

  return (
    <>
      <PageHeader
        title="Students"
        description="Search students, review AI analysis, and download individual report cards."
      />

      {error && <div className="mb-6 rounded-lg border border-rose-300/20 bg-rose-400/10 p-4 text-rose-100">{error}</div>}

      <section className="glass-card mb-6">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            className="field pl-11"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by name, grade, email, risk, or learning gap"
          />
        </label>
      </section>

      <section className="glass-card overflow-hidden p-0">
        {teacherStudents.length === 0 && !loading ? (
          <EmptyState
            description="Add a real student record with marks, attendance, student email, and parent email to activate every portal."
            action={
              <Link to="/teacher/add-student" className="primary-button">
                <PlusCircle size={18} />
                Add Student
              </Link>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1320px] text-left text-sm">
              <thead className="border-b border-white/10 bg-white/[0.04] text-xs uppercase tracking-[0.2em] text-slate-400">
                <tr>
                  <th className="px-5 py-4">Name</th>
                  <th className="px-5 py-4">Grade</th>
                  <th className="px-5 py-4">Attendance</th>
                  <th className="px-5 py-4">Star Points</th>
                  <th className="px-5 py-4">Contributions</th>
                  <th className="px-5 py-4">Risk Level</th>
                  <th className="px-5 py-4">Learning Gap</th>
                  <th className="px-5 py-4">Recommendation</th>
                  <th className="px-5 py-4">Report</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {loading
                  ? Array.from({ length: 4 }).map((_, index) => (
                      <tr key={index}>
                        <td className="px-5 py-5" colSpan={9}>
                          <div className="h-5 animate-pulse rounded bg-white/10" />
                        </td>
                      </tr>
                    ))
                  : filteredStudents.map((student) => {
                      const contributionStats = getContributionStats(student)

                      return (
                        <tr key={student.id} className="align-top transition hover:bg-white/[0.03]">
                          <td className="px-5 py-4 font-semibold text-white">{student.name}</td>
                          <td className="px-5 py-4 text-slate-300">{student.grade}</td>
                          <td className="px-5 py-4 text-slate-300">{student.attendance}%</td>
                          <td className="px-5 py-4">
                            <span className="inline-flex items-center gap-2 rounded-full bg-amber-300/15 px-3 py-1 text-xs font-bold text-amber-100">
                              <Star size={14} />
                              {Number(student.starPoints || 0)}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-300/15 px-3 py-1 text-xs font-bold text-emerald-100">
                              <GitBranch size={14} />
                              {contributionStats.total}
                            </span>
                            <p className="mt-2 text-xs text-slate-500">
                              {contributionStats.lastContributionDate ? `Last ${contributionStats.lastContributionDate.toLocaleDateString()}` : 'No uploads yet'}
                            </p>
                          </td>
                          <td className="px-5 py-4">
                            <StatusBadge riskLevel={student.riskLevel} />
                          </td>
                          <td className="max-w-xs px-5 py-4 text-slate-300">{student.learningGap}</td>
                          <td className="max-w-sm px-5 py-4 text-slate-400">{student.recommendation}</td>
                          <td className="px-5 py-4">
                            <button type="button" className="secondary-button px-3 py-2" onClick={() => downloadStudentReport(student)}>
                              <Download size={16} />
                              Download
                            </button>
                          </td>
                        </tr>
                      )
                    })}
              </tbody>
            </table>
            {!loading && filteredStudents.length === 0 && (
              <div className="border-t border-white/10 p-6 text-sm text-slate-300">No students match "{searchTerm}".</div>
            )}
          </div>
        )}
      </section>
    </>
  )
}

export default Students
