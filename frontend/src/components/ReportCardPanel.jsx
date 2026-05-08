import { Download, FileText } from 'lucide-react'
import { buildStudentProfile } from '../utils/academicIntelligence'
import { downloadStudentReport } from '../utils/reportCard'

function ReportCardPanel({ student, compact = false }) {
  if (!student) return null

  const profile = buildStudentProfile(student)

  return (
    <section className={compact ? 'rounded-lg border border-white/10 bg-black/20 p-4' : 'glass-card'}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-cyan-100">
            <FileText size={20} />
            <p className="text-sm font-semibold">Report Card</p>
          </div>
          <h2 className="mt-3 text-xl font-bold text-white">{profile.name}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Average {profile.average}% - Attendance {profile.attendance}% - Priority area {profile.weakest.label}
          </p>
        </div>
        <button type="button" className="primary-button shrink-0" onClick={() => downloadStudentReport(student)}>
          <Download size={18} />
          Download Report
        </button>
      </div>

      {!compact && (
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {profile.mastery.map((item) => (
            <div key={item.subject} className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
              <p className="text-sm font-semibold text-white">{item.subject}</p>
              <p className="mt-1 text-2xl font-black text-cyan-100">{item.score}%</p>
              <p className="mt-1 text-xs text-slate-400">{item.concept}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default ReportCardPanel
