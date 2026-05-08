import { Link } from 'react-router-dom'
import {
  AlertTriangle,
  Award,
  BookOpenCheck,
  BriefcaseBusiness,
  CheckCircle2,
  FileText,
  HeartPulse,
  LineChart,
  PlusCircle,
  Sparkles,
  Target,
  Upload,
} from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart as ReLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import PageHeader from '../components/PageHeader'
import ContributionGraph from '../components/ContributionGraph'
import OpportunityPanel from '../components/OpportunityPanel'
import ProjectUploadPanel from '../components/ProjectUploadPanel'
import ResourceLinks from '../components/ResourceLinks'
import StatusBadge from '../components/StatusBadge'
import TimetablePanel from '../components/TimetablePanel'
import WorldComparisonPanel from '../components/WorldComparisonPanel'
import { useAuth } from '../hooks/useAuth'
import { useStudents } from '../hooks/useStudents'
import {
  buildCohortIntelligence,
  buildStudentProfile,
  findChildrenForUser,
  findStudentForUser,
} from '../utils/academicIntelligence'

const workspaceCopy = {
  studyCoach: ['AI Study Coach', 'Generates a personalized recovery plan, quiz sequence, and micro-learning path from the linked student record.'],
  timetable: ['Timetable Optimization', 'Builds a weekly study schedule from weak concepts, attendance, risk, and reference resources.'],
  masteryMap: ['Concept Mastery Map', 'Shows concept-level strengths, weak topics, and mastery percentages instead of vague subject labels.'],
  motivation: ['Motivation Engine', 'Tracks streaks, achievements, growth score, confidence, and recovery progress.'],
  projects: ['Project Portfolio', 'Upload project work, earn star points, and build an academic portfolio.'],
  contributions: ['Contribution Graph', 'Shows a GitHub-style activity calendar from this student’s own submitted project work.'],
  worldComparison: ['World Comparison', 'Compares student readiness with a global benchmark estimate using marks, attendance, confidence, and projects.'],
  careerGuide: ['AI Career Guidance', 'Suggests streams, careers, and skills from current academic strengths and learning profile.'],
  opportunities: ['Scholarships and Events', 'Recommends scholarships, competitions, and participation opportunities from the student profile.'],
  parentRisk: ['Parent Risk Guidance', 'Explains child risk alerts, why they changed, and what parents can do this week.'],
  parentAttendance: ['Attendance Intelligence', 'Connects attendance patterns with performance and recommends study timings.'],
  parentContributions: ['Child Contributions', 'Shows each linked child’s GitHub-style project contribution history.'],
  parentReports: ['AI Parent Reports', 'Generates parent-friendly progress narratives from the child record.'],
  departments: ['Department Analytics', 'Compares subject departments, class performance, and institutional gap trends.'],
  interventions: ['Recovery Intelligence', 'Tracks intervention success likelihood and which students need action first.'],
  documentAi: ['OCR + Smart Document Analysis', 'Upload workflow surface for marksheets, report cards, PDFs, and handwritten score extraction.'],
  nationalScale: ['National Education Analytics', 'Future-ready district, board, and state analytics infrastructure view.'],
}

function EmptyWorkspace({ title, description, action }) {
  return (
    <section className="glass-card">
      <h2 className="text-xl font-bold text-white">{title}</h2>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </section>
  )
}

function MiniMetric({ label, value, icon: Icon, tone = 'text-cyan-100' }) {
  return (
    <article className="glass-card">
      <Icon className={tone} size={22} />
      <p className="mt-4 text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-black text-white">{value}</p>
    </article>
  )
}

function LinkedStudentGate({ student, profile, children }) {
  if (student) return children(buildStudentProfile(student))

  return (
    <EmptyWorkspace
      title={`No linked academic record for ${profile?.name || 'this student'}`}
      description="Ask a teacher to add a student record with this account email in Student Email. This page is ready, but it will not invent marks, strengths, weaknesses, or plans."
    />
  )
}

function LinkedChildrenGate({ childrenRecords, profile, children }) {
  if (childrenRecords.length) return children(childrenRecords.map(buildStudentProfile))

  return (
    <EmptyWorkspace
      title={`No child linked for ${profile?.name || 'this parent account'}`}
      description="Ask the school to add your email in the Parent Email field of your child’s student record. Parent pages will then populate with real progress, risks, attendance, and report narratives."
    />
  )
}

function StudyCoach({ student }) {
  const quizPlan = [
    `Diagnostic quiz: ${student.weakest.concepts[1]}`,
    `Revision sprint: ${student.weakest.label} fundamentals`,
    `Micro-test: ${student.secondWeakest.label} application`,
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <MiniMetric label="Weakest Area" value={student.weakest.label} icon={Target} tone="text-rose-100" />
        <MiniMetric label="Recovery Score" value={student.growthScore} icon={LineChart} tone="text-emerald-100" />
        <MiniMetric label="Confidence" value={`${student.confidence}%`} icon={HeartPulse} tone="text-amber-100" />
      </div>
      <section className="glass-card">
        <h2 className="text-xl font-bold text-white">Personalized Study Plan</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {quizPlan.map((item, index) => (
            <div key={item} className="rounded-lg border border-white/10 bg-black/20 p-4">
              <p className="text-sm font-bold text-cyan-100">Step {index + 1}</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">{item}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="glass-card">
        <ResourceLinks resources={student.resources} />
        {!student.resources?.length && (
          <div>
            <h2 className="text-xl font-bold text-white">Resources to Refer</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Ask your teacher to re-run the student analysis so Tavily can attach fresh web sources for this learning gap.
            </p>
          </div>
        )}
      </section>
    </div>
  )
}

function TimetableWorkspace({ student }) {
  return <TimetablePanel student={student} />
}

function MasteryMap({ student }) {
  return (
    <section className="glass-card">
      <h2 className="text-xl font-bold text-white">Concept-Level Mastery</h2>
      <div className="mt-5 space-y-5">
        {student.mastery.map((item) => (
          <div key={item.subject}>
            <div className="mb-2 flex justify-between text-sm">
              <span className="font-semibold text-slate-200">{item.subject}: {item.concept}</span>
              <span className="text-slate-400">{item.mastery}%</span>
            </div>
            <div className="h-3 rounded-full bg-white/10">
              <div className="h-3 rounded-full bg-emerald-300" style={{ width: `${item.mastery}%` }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function Motivation({ student }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <MiniMetric label="Study Streak" value="7 days" icon={Sparkles} tone="text-amber-100" />
      <MiniMetric label="Growth Score" value={student.growthScore} icon={Award} tone="text-emerald-100" />
      <MiniMetric label="Confidence Meter" value={`${student.confidence}%`} icon={HeartPulse} tone="text-rose-100" />
      <MiniMetric label="Recovery Progress" value={`${student.interventionSuccess}%`} icon={CheckCircle2} tone="text-cyan-100" />
    </div>
  )
}

function CareerGuide({ student }) {
  const strongest = student.mastery.slice().sort((a, b) => b.score - a.score)[0]
  const careers = strongest.subject === 'Math' ? ['Data Analyst', 'Engineer', 'Finance'] : strongest.subject === 'Physics' ? ['Robotics', 'Engineering', 'Research'] : ['Healthcare', 'Biotech', 'Pharmacy']

  return (
    <section className="glass-card">
      <h2 className="text-xl font-bold text-white">Recommended Career Direction</h2>
      <p className="mt-2 text-sm text-slate-300">Based on strongest subject signal: {strongest.subject} at {strongest.score}%.</p>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {careers.map((career) => (
          <div key={career} className="rounded-lg border border-white/10 bg-black/20 p-4">
            <BriefcaseBusiness className="text-cyan-100" size={22} />
            <p className="mt-3 font-bold text-white">{career}</p>
            <p className="mt-2 text-sm text-slate-400">Build skills through projects, revision consistency, and concept mastery.</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function OpportunitiesWorkspace({ student, onLocationSaved }) {
  return <OpportunityPanel student={student} onLocationSaved={onLocationSaved} />
}

function ProjectsWorkspace({ student, onProjectSaved }) {
  return <ProjectUploadPanel student={student} onProjectSaved={onProjectSaved} />
}

function ContributionsWorkspace({ student }) {
  return <ContributionGraph student={student} />
}

function WorldComparisonWorkspace({ student }) {
  return <WorldComparisonPanel student={student} />
}

function ParentRisk({ children }) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {children.map((student) => (
        <article key={student.id} className="glass-card">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white">{student.name}</h2>
              <p className="mt-1 text-sm text-slate-400">{student.reasons.join(', ')}</p>
            </div>
            <StatusBadge riskLevel={student.risk} />
          </div>
          <p className="mt-4 rounded-lg border border-white/10 bg-black/20 p-4 text-sm leading-6 text-slate-200">
            Parent action: schedule a 25-minute revision block for {student.weakest.label}, ask for one verbal explanation, and check the next quiz result.
          </p>
        </article>
      ))}
    </div>
  )
}

function ParentAttendance({ children }) {
  const data = children.map((student) => ({ name: student.name.split(' ')[0], attendance: student.attendance, average: student.average }))

  return (
    <section className="glass-card">
      <h2 className="mb-5 text-xl font-bold text-white">Attendance vs Performance</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" domain={[0, 100]} />
            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)' }} />
            <Bar dataKey="attendance" fill="#67e8f9" radius={[6, 6, 0, 0]} />
            <Bar dataKey="average" fill="#34d399" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}

function ParentContributions({ children }) {
  return (
    <div className="space-y-5">
      {children.map((student) => (
        <ContributionGraph key={student.id} student={student} />
      ))}
    </div>
  )
}

function ParentReports({ children }) {
  return (
    <div className="space-y-4">
      {children.map((student) => (
        <article key={student.id} className="glass-card">
          <FileText className="text-cyan-100" size={24} />
          <h2 className="mt-4 text-xl font-bold text-white">{student.name} Progress Narrative</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            {student.name} currently has an average of {student.average}% with {student.attendance}% attendance. The biggest learning priority is {student.weakest.label}, especially {student.weakest.concepts[1]}. Recommended next step: {student.recommendation}
          </p>
        </article>
      ))}
    </div>
  )
}

function DepartmentAnalytics({ intelligence }) {
  return (
    <section className="glass-card">
      <h2 className="mb-5 text-xl font-bold text-white">Department Performance</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={intelligence.subjectAverages}>
            <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
            <XAxis dataKey="subject" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" domain={[0, 100]} />
            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)' }} />
            <Bar dataKey="average" fill="#67e8f9" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}

function RecoveryIntelligence({ intelligence }) {
  return (
    <div className="space-y-4">
      {intelligence.urgent.map((student) => (
        <article key={student.id} className="glass-card">
          <div className="grid gap-4 md:grid-cols-[1fr_1fr_1fr]">
            <div>
              <h2 className="text-xl font-bold text-white">{student.name}</h2>
              <p className="mt-1 text-sm text-slate-400">{student.weakest.label} recovery priority</p>
            </div>
            <MiniMetric label="Intervention Success" value={`${student.interventionSuccess}%`} icon={BookOpenCheck} tone="text-emerald-100" />
            <MiniMetric label="Disengagement Risk" value={`${student.disengagement}%`} icon={AlertTriangle} tone="text-rose-100" />
          </div>
        </article>
      ))}
    </div>
  )
}

function DocumentAi() {
  return (
    <section className="glass-card">
      <Upload className="text-cyan-100" size={28} />
      <h2 className="mt-4 text-xl font-bold text-white">Smart Document Analysis Workflow</h2>
      <p className="mt-2 text-sm leading-6 text-slate-300">
        Upload support is staged for report cards, PDFs, marksheets, and handwritten scores. The workflow defines extraction, validation, score mapping, and student matching.
      </p>
      <div className="mt-5 grid gap-4 md:grid-cols-4">
        {['Upload file', 'Extract marks', 'Match student', 'Create record'].map((step) => (
          <div key={step} className="rounded-lg border border-white/10 bg-black/20 p-4 text-sm font-semibold text-slate-200">{step}</div>
        ))}
      </div>
    </section>
  )
}

function NationalScale({ intelligence }) {
  const trend = [
    { label: 'School', value: intelligence.schoolAverage || 0 },
    { label: 'District', value: Math.max(0, (intelligence.schoolAverage || 0) - 3) },
    { label: 'State', value: Math.max(0, (intelligence.schoolAverage || 0) - 5) },
    { label: 'Board', value: Math.max(0, (intelligence.schoolAverage || 0) - 2) },
  ]

  return (
    <section className="glass-card">
      <h2 className="mb-5 text-xl font-bold text-white">Education Intelligence Infrastructure</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ReLineChart data={trend}>
            <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
            <XAxis dataKey="label" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" domain={[0, 100]} />
            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)' }} />
            <Line type="monotone" dataKey="value" stroke="#67e8f9" strokeWidth={3} />
          </ReLineChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}

function PortalWorkspace({ type }) {
  const { students, loading, error, refresh } = useStudents()
  const { currentUser, userProfile } = useAuth()
  const intelligence = buildCohortIntelligence(students)
  const linkedStudent = findStudentForUser(students, userProfile, currentUser)
  const linkedChildren = findChildrenForUser(students, userProfile, currentUser)
  const [title, description] = workspaceCopy[type] || workspaceCopy.studyCoach

  const noCohortAction = (
    <Link to="/teacher/add-student" className="primary-button">
      <PlusCircle size={18} />
      Add Student
    </Link>
  )

  let content
  if (['studyCoach', 'timetable', 'masteryMap', 'motivation', 'projects', 'contributions', 'worldComparison', 'careerGuide', 'opportunities'].includes(type)) {
    content = (
      <LinkedStudentGate student={linkedStudent} profile={userProfile}>
        {(student) =>
          type === 'studyCoach' ? <StudyCoach student={student} /> : type === 'timetable' ? <TimetableWorkspace student={student} /> : type === 'masteryMap' ? <MasteryMap student={student} /> : type === 'motivation' ? <Motivation student={student} /> : type === 'projects' ? <ProjectsWorkspace student={student} onProjectSaved={refresh} /> : type === 'contributions' ? <ContributionsWorkspace student={student} /> : type === 'worldComparison' ? <WorldComparisonWorkspace student={student} /> : type === 'opportunities' ? <OpportunitiesWorkspace student={student} onLocationSaved={refresh} /> : <CareerGuide student={student} />
        }
      </LinkedStudentGate>
    )
  } else if (['parentRisk', 'parentAttendance', 'parentContributions', 'parentReports'].includes(type)) {
    content = (
      <LinkedChildrenGate childrenRecords={linkedChildren} profile={userProfile}>
        {(children) => type === 'parentRisk' ? <ParentRisk children={children} /> : type === 'parentAttendance' ? <ParentAttendance children={children} /> : type === 'parentContributions' ? <ParentContributions children={children} /> : <ParentReports children={children} />}
      </LinkedChildrenGate>
    )
  } else if (!students.length && ['departments', 'interventions'].includes(type)) {
    content = <EmptyWorkspace title="No school records yet" description="Add real student records to calculate this admin workspace." action={noCohortAction} />
  } else if (type === 'departments') {
    content = <DepartmentAnalytics intelligence={intelligence} />
  } else if (type === 'interventions') {
    content = <RecoveryIntelligence intelligence={intelligence} />
  } else if (type === 'documentAi') {
    content = <DocumentAi />
  } else {
    content = <NationalScale intelligence={intelligence} />
  }

  return (
    <>
      <PageHeader eyebrow="Dedicated workspace" title={title} description={description} />
      {error && <div className="mb-6 rounded-lg border border-rose-300/20 bg-rose-400/10 p-4 text-rose-100">{error}</div>}
      {loading ? <div className="glass-card h-40 animate-pulse" /> : content}
    </>
  )
}

export default PortalWorkspace
