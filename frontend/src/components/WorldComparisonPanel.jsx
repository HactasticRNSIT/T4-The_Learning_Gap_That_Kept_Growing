import { BriefcaseBusiness, ExternalLink, Globe2, Star, Target } from 'lucide-react'
import { buildWorldComparison } from '../utils/worldComparison'

function fallbackCompanies(comparison) {
  const strongest = comparison.student.mastery.slice().sort((a, b) => b.score - a.score)[0]

  if (strongest.subject === 'Physics') {
    return [
      {
        company: 'Siemens',
        roleTrack: 'Engineering, automation, and industrial technology',
        applyUrl: 'https://www.siemens.com/global/en/company/jobs.html',
        details: 'Explore engineering and technology career paths.',
        fitReason: 'Physics strength connects to systems, energy, and automation.',
        readinessAction: 'Build one sensor, electronics, or energy project.',
      },
      {
        company: 'Tesla',
        roleTrack: 'Robotics, mobility, and energy systems',
        applyUrl: 'https://www.tesla.com/careers',
        details: 'Explore engineering and product career paths.',
        fitReason: 'Physics supports mechanics, circuits, and systems thinking.',
        readinessAction: 'Document a simulation, robotics, or mobility project.',
      },
    ]
  }

  if (strongest.subject === 'Chemistry') {
    return [
      {
        company: 'Biocon',
        roleTrack: 'Biotech, healthcare, and lab research',
        applyUrl: 'https://www.biocon.com/careers/',
        details: 'Explore biotech and healthcare career paths.',
        fitReason: 'Chemistry strength connects to pharma and biotechnology.',
        readinessAction: 'Build a science fair project with experiment notes.',
      },
      {
        company: "Dr. Reddy's Laboratories",
        roleTrack: 'Pharma research, quality, and applied science',
        applyUrl: 'https://careers.drreddys.com/',
        details: 'Explore pharmaceutical career pathways.',
        fitReason: 'Chemistry fundamentals support lab and pharma roles.',
        readinessAction: 'Create a chemistry model or research poster.',
      },
    ]
  }

  return [
    {
      company: 'Google',
      roleTrack: 'Software, data, and AI foundations',
      applyUrl: 'https://careers.google.com/students/',
      details: 'Student and early career opportunities.',
      fitReason: 'Math and project work support coding and analytics pathways.',
      readinessAction: 'Build two projects with data, charts, or simple AI.',
    },
    {
      company: 'Microsoft',
      roleTrack: 'Software engineering, cloud, and product building',
      applyUrl: 'https://careers.microsoft.com/students/',
      details: 'Student and early career opportunities.',
      fitReason: 'Structured problem solving supports engineering pathways.',
      readinessAction: 'Build one web app and one problem-solving project.',
    },
  ]
}

function WorldComparisonPanel({ student, compact = false }) {
  if (!student) return null

  const comparison = buildWorldComparison(student)
  const companies =
    Array.isArray(student.companyRecommendations) && student.companyRecommendations.length
      ? student.companyRecommendations.slice(0, compact ? 2 : 4)
      : fallbackCompanies(comparison).slice(0, compact ? 2 : 4)

  return (
    <section className={compact ? 'rounded-lg border border-white/10 bg-black/20 p-4' : 'glass-card'}>
      <div className="flex items-center gap-2 text-sky-100">
        <Globe2 size={20} />
        <p className="text-sm font-semibold">World Comparison</p>
      </div>
      <h2 className="mt-3 text-xl font-bold text-white">{comparison.benchmark}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-300">
        Estimated global readiness percentile based on marks, attendance, confidence, and project star points.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
          <Globe2 className="text-sky-100" size={20} />
          <p className="mt-3 text-sm text-slate-400">Readiness Percentile</p>
          <p className="mt-1 text-3xl font-black text-white">{comparison.percentile}%</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
          <Star className="text-amber-100" size={20} />
          <p className="mt-3 text-sm text-slate-400">Star Points</p>
          <p className="mt-1 text-3xl font-black text-white">{comparison.starPoints}</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
          <Target className="text-emerald-100" size={20} />
          <p className="mt-3 text-sm text-slate-400">Next Target</p>
          <p className="mt-1 text-base font-bold text-white">{comparison.nextTarget}</p>
        </div>
      </div>

      {!compact && (
        <p className="mt-4 rounded-lg border border-sky-300/20 bg-sky-300/10 p-4 text-sm leading-6 text-slate-200">
          Current project rank: {comparison.projectRank}. Uploading useful projects increases star points and improves this benchmark.
        </p>
      )}

      <div className="mt-5">
        <div className="flex items-center gap-2 text-cyan-100">
          <BriefcaseBusiness size={20} />
          <p className="text-sm font-semibold">Company Fit and Apply Paths</p>
        </div>
        <div className="mt-3 grid gap-3">
          {companies.map((company) => (
            <article key={`${company.company}-${company.applyUrl}`} className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-base font-bold text-white">{company.company}</p>
                  <p className="mt-1 text-sm font-semibold text-cyan-100">{company.roleTrack}</p>
                </div>
                {company.applyUrl && (
                  <a
                    href={company.applyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-100 hover:text-emerald-50"
                  >
                    Apply path
                    <ExternalLink size={15} />
                  </a>
                )}
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-300">{company.details}</p>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <div className="rounded-lg border border-white/10 bg-black/20 p-3">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Why it fits</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{company.fitReason}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-black/20 p-3">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Next step</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{company.readinessAction}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WorldComparisonPanel
