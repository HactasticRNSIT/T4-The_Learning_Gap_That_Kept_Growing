import { motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import {
  AlertTriangle,
  BarChart3,
  BookOpenCheck,
  Bot,
  Brain,
  CalendarClock,
  FileText,
  GraduationCap,
  HeartPulse,
  LineChart as LineChartIcon,
  Mic,
  Network,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Upload,
  Users,
} from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import ContributionGraph from '../components/ContributionGraph'
import PageHeader from '../components/PageHeader'
import OpportunityPanel from '../components/OpportunityPanel'
import ProjectUploadPanel from '../components/ProjectUploadPanel'
import ReportCardPanel from '../components/ReportCardPanel'
import ResourceLinks from '../components/ResourceLinks'
import StatusBadge from '../components/StatusBadge'
import StudentActivityFeed from '../components/StudentActivityFeed'
import TimetablePanel from '../components/TimetablePanel'
import WorldComparisonPanel from '../components/WorldComparisonPanel'
import { useAuth } from '../hooks/useAuth'
import { useStudents } from '../hooks/useStudents'
import {
  buildCohortIntelligence,
  buildStudentProfile,
  clamp,
  findChildrenForUser,
  findStudentForUser,
} from '../utils/academicIntelligence'

const portalCopy = {
  teacher: {
    eyebrow: 'Teacher Intelligence Portal',
    title: 'Teacher Intelligence Portal',
    description:
      'Student risk analysis, learning gap prediction, weak concept detection, intervention suggestions, heatmaps, summaries, attendance correlation, subject analytics, and trajectory graphs.',
  },
  student: {
    eyebrow: 'Student Portal',
    title: 'Student Growth Portal',
    description:
      'Personalized strengths, weaknesses, AI study coach, recovery progress, concept mastery, quizzes, revision paths, streaks, achievements, confidence, and growth scores.',
  },
  parent: {
    eyebrow: 'Parent Portal',
    title: 'Parent Guidance Portal',
    description:
      'Child progress, risk alerts, attendance patterns, and AI-generated parent guidance written in clear intervention language.',
  },
  admin: {
    eyebrow: 'School Admin Portal',
    title: 'School Admin Intelligence',
    description:
      'School-wide analytics, department performance, class comparisons, teacher effectiveness, intervention success, and institutional learning-gap trends.',
  },
  prediction: {
    eyebrow: 'AI Prediction Engine',
    title: 'Prediction, Explainability, and Recovery Engine',
    description:
      'Failure risk, dropout probability, disengagement probability, intervention success likelihood, explainable AI reasons, recovery intelligence, and digital twin simulation.',
  },
  copilot: {
    eyebrow: 'AI Academic Copilot',
    title: 'Academic Copilot and Automation Lab',
    description:
      'Ask school intelligence questions, generate remediation strategy, report cards, learning paths, timetable plans, voice commands, OCR ingestion, and career guidance.',
  },
}

const featureTiles = [
  { label: 'Explainable AI', icon: Brain, value: 'Why scores changed' },
  { label: 'Smart Intervention', icon: Target, value: 'Auto action plans' },
  { label: 'Digital Twin', icon: Network, value: 'Delay simulation' },
  { label: 'Voice Assistant', icon: Mic, value: 'Command-ready' },
  { label: 'OCR Analysis', icon: Upload, value: 'Report upload flow' },
  { label: 'Career Guidance', icon: GraduationCap, value: 'Strength-based paths' },
]

const copilotQuestions = [
  'Why is Class 8B underperforming?',
  'Which students need urgent intervention?',
  'Generate a 14-day remediation strategy.',
  'Which concepts are blocking recovery?',
]

const readinessByMode = {
  teacher: [
    { title: 'Add real student records', text: 'Use attendance, marks, remarks, student email, and parent email to activate live analytics.' },
    { title: 'Review risk queue', text: 'High-risk records appear in Risk Alerts with concept gaps and intervention suggestions.' },
    { title: 'Run prediction engine', text: 'Decline, dropout, failure, disengagement, and intervention likelihood are calculated from records.' },
  ],
  student: [
    { title: 'Link your record', text: 'Ask your teacher to add your student email or exact account name to your student record.' },
    { title: 'Open study coach', text: 'Once linked, your weakest concept, recovery plan, quizzes, and mastery map unlock automatically.' },
    { title: 'Track motivation', text: 'Growth score, confidence meter, streaks, achievements, and recovery progress use your real marks.' },
  ],
  parent: [
    { title: 'Link child by parent email', text: 'Ask the school to add your email in the Parent Email field on your child’s record.' },
    { title: 'Review guidance', text: 'Progress narratives, risk alerts, attendance patterns, and parent actions will appear here.' },
    { title: 'Use reports', text: 'AI report-card summaries become available once your child has real performance data.' },
  ],
  admin: [
    { title: 'Collect class records', text: 'Admin analytics activate when teachers add students across grades and departments.' },
    { title: 'Compare departments', text: 'School averages, department gaps, teacher effectiveness, and recovery rates calculate live.' },
    { title: 'Scale insights', text: 'Institution heatmaps, scholarship flags, risk trends, and future national analytics use cohort data.' },
  ],
  prediction: [
    { title: 'Feed real signals', text: 'Scores, attendance, remarks, risk labels, gaps, and recommendations drive every prediction.' },
    { title: 'Explain every score', text: 'Each risk includes the reason: attendance, weak subject, AI risk label, and performance trend.' },
    { title: 'Simulate recovery', text: 'The digital twin projects delayed intervention versus weekly recovery outcomes.' },
  ],
  copilot: [
    { title: 'Ask cohort questions', text: 'The copilot answers from current records, not hard-coded sample students.' },
    { title: 'Generate strategy', text: 'Remediation plans, report narratives, learning paths, and voice-ready actions use live data.' },
    { title: 'Automate documents', text: 'OCR/document AI is staged as an admin workflow for uploaded marksheets and report cards.' },
  ],
}

const modulesByMode = {
  teacher: [
    ['Student risk analysis', 'Ready'],
    ['Learning gap prediction', 'Ready'],
    ['Weak concept detection', 'Ready'],
    ['Intervention suggestions', 'Ready'],
    ['Class heatmaps', 'Ready'],
    ['Academic summaries', 'Ready'],
    ['Attendance correlation', 'Ready'],
    ['Student contribution updates', 'Ready'],
    ['Subject analytics', 'Ready'],
    ['Trajectory graphs', 'Ready'],
  ],
  student: [
    ['Strengths and weaknesses', 'Linked record required'],
    ['AI learning assistant', 'Ready'],
    ['Personalized study plans', 'Linked record required'],
    ['Recovery progress', 'Linked record required'],
    ['Concept mastery map', 'Linked record required'],
    ['Quizzes and micro-paths', 'Ready'],
    ['Motivation engine', 'Ready'],
    ['Career guidance', 'Ready'],
  ],
  parent: [
    ['Child progress', 'Child link required'],
    ['Risk alerts', 'Child link required'],
    ['Attendance patterns', 'Child link required'],
    ['Child contribution graph', 'Child link required'],
    ['AI parent guidance', 'Child link required'],
    ['Report summaries', 'Child link required'],
  ],
  admin: [
    ['School-wide analytics', 'Ready'],
    ['Department performance', 'Ready'],
    ['Class comparisons', 'Ready'],
    ['Teacher effectiveness', 'Ready'],
    ['Intervention success rates', 'Ready'],
    ['Institutional gap trends', 'Ready'],
    ['Scholarship and risk flags', 'Ready'],
    ['School-level heatmaps', 'Ready'],
    ['National analytics vision', 'Ready'],
  ],
  prediction: [
    ['Future academic decline', 'Ready'],
    ['Dropout probability', 'Ready'],
    ['Subject failure risk', 'Ready'],
    ['Disengagement probability', 'Ready'],
    ['Intervention success likelihood', 'Ready'],
    ['Explainable AI reasons', 'Ready'],
    ['Educational digital twin', 'Ready'],
  ],
  copilot: [
    ['Academic copilot chat prompts', 'Ready'],
    ['Remediation strategy generator', 'Ready'],
    ['AI report card generator', 'Ready'],
    ['Learning path generator', 'Ready'],
    ['Timetable optimization', 'Ready'],
    ['Voice AI command surface', 'Ready'],
    ['OCR document analysis', 'Ready'],
  ],
}

const routeFocus = {
  'study-coach': 'AI Study Coach',
  'mastery-map': 'Concept Mastery Map',
  motivation: 'Motivation Engine',
  contributions: 'Contribution Graph',
  'career-guide': 'AI Career Guidance',
  'risk-guidance': 'Risk Guidance',
  attendance: 'Attendance Intelligence',
  reports: 'AI Report Cards',
  departments: 'Department Analytics',
  interventions: 'Recovery Intelligence',
  'document-ai': 'OCR and Document AI',
  'national-scale': 'National Education Analytics',
}

function MetricCard({ label, value, icon: Icon, tone = 'text-cyan-100' }) {
  return (
    <article className="glass-card">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-slate-400">{label}</p>
        <Icon className={tone} size={22} />
      </div>
      <p className="mt-4 text-3xl font-black text-white">{value}</p>
    </article>
  )
}

function ReadinessPanel({ mode, userProfile, currentUser, recordCount, linked }) {
  const steps = readinessByMode[mode] || readinessByMode.teacher
  const modules = modulesByMode[mode] || modulesByMode.teacher
  const name = userProfile?.name || currentUser?.displayName || 'AstraLearn user'

  return (
    <div className="space-y-5">
      <section className="glass-card">
        <div className="grid gap-4 lg:grid-cols-[1fr_0.85fr] lg:items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-200">Portal readiness</p>
            <h2 className="mt-3 text-2xl font-black text-white">Welcome, {name}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              This page is ready and connected to your account. AstraLearn is using real records only, so analytics unlock as soon as matching student data exists.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <MetricCard label="Live Student Records" value={recordCount} icon={Users} />
            <MetricCard label="Account Link" value={linked ? 'Linked' : 'Pending'} icon={ShieldCheck} tone={linked ? 'text-emerald-100' : 'text-amber-100'} />
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {steps.map((step) => (
          <article key={step.title} className="glass-card">
            <Sparkles className="mb-3 text-cyan-100" size={22} />
            <h3 className="font-bold text-white">{step.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">{step.text}</p>
          </article>
        ))}
      </section>

      <section className="glass-card">
        <h2 className="mb-4 text-xl font-bold text-white">Working Modules</h2>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {modules.map(([title, status]) => (
            <div key={title} className="rounded-lg border border-white/10 bg-black/20 p-4">
              <p className="font-semibold text-white">{title}</p>
              <p className="mt-2 text-sm text-slate-400">{status}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function FocusBanner({ focus }) {
  if (!focus) return null

  return (
    <section className="glass-card border-cyan-300/20 bg-cyan-300/10">
      <div className="flex items-center gap-3">
        <Target className="text-cyan-100" size={22} />
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-100">Current workspace</p>
          <h2 className="mt-1 text-xl font-bold text-white">{focus}</h2>
        </div>
      </div>
    </section>
  )
}

function RealDataEmpty({ title, description, action, mode, userProfile, currentUser, recordCount = 0, linked = false }) {
  return (
    <div className="space-y-5">
      <section className="glass-card">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">{title}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">{description}</p>
          </div>
          {action}
        </div>
      </section>
      <ReadinessPanel mode={mode} userProfile={userProfile} currentUser={currentUser} recordCount={recordCount} linked={linked} />
    </div>
  )
}

function HeatCell({ item }) {
  const color =
    item.value < 50
      ? 'bg-rose-400/70 text-rose-50'
      : item.value < 70
        ? 'bg-amber-300/70 text-slate-950'
        : 'bg-emerald-300/75 text-slate-950'

  return (
    <div className={`rounded-md px-3 py-2 text-center text-xs font-bold ${color}`}>
      <span className="block truncate">{item.student}</span>
      <span className="block">{item.subject} {item.value}%</span>
    </div>
  )
}

function TeacherView({ intelligence, userProfile, currentUser }) {
  const topStudent = intelligence.urgent[0]
  const correlation = clamp(100 - Math.abs(intelligence.attendanceAverage - intelligence.schoolAverage))

  if (!intelligence.students.length) {
    return (
      <RealDataEmpty
        title="No real student records yet"
        description="Teacher analytics, heatmaps, prediction, weak concept detection, and interventions will activate after you add real student records. AstraLearn will not invent names or scores."
        mode="teacher"
        userProfile={userProfile}
        currentUser={currentUser}
        recordCount={intelligence.students.length}
        action={
          <Link to="/teacher/add-student" className="primary-button shrink-0">
            <Users size={18} />
            Add Student
          </Link>
        }
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="School Learning Health" value={`${intelligence.schoolAverage}%`} icon={ShieldCheck} />
        <MetricCard label="High Risk Students" value={intelligence.riskCounts.High} icon={AlertTriangle} tone="text-rose-200" />
        <MetricCard label="Attendance Correlation" value={`${correlation}%`} icon={LineChartIcon} tone="text-amber-100" />
        <MetricCard label="Intervention Success" value={`${intelligence.interventionSuccess}%`} icon={TrendingUp} tone="text-emerald-100" />
      </div>

      <StudentActivityFeed students={intelligence.students} />

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="glass-card">
          <h2 className="mb-5 text-xl font-bold text-white">Class Performance Heatmap</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
            {intelligence.heatmap.map((item) => (
              <HeatCell key={`${item.student}-${item.subject}`} item={item} />
            ))}
          </div>
        </section>

        <section className="glass-card">
          <h2 className="mb-4 text-xl font-bold text-white">AI Academic Summary</h2>
          <p className="text-sm leading-6 text-slate-300">
            {intelligence.gapTrend.subject} is the lowest-performing department signal at {intelligence.gapTrend.average}%.
            {topStudent.name} needs the fastest response because {topStudent.reasons.join(', ')}.
          </p>
          <div className="mt-5 rounded-lg border border-cyan-300/20 bg-cyan-300/10 p-4">
            <p className="text-sm font-semibold text-cyan-100">Suggested intervention</p>
            <p className="mt-2 text-sm leading-6 text-slate-200">
              Run concept-level recovery groups for {intelligence.gapTrend.subject}, assign short diagnostic quizzes, and review attendance-linked students every Friday.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}

function StudentView({ linkedStudent, userProfile, currentUser, recordCount, onProjectSaved }) {
  if (!linkedStudent) {
    const name = userProfile?.name || currentUser?.displayName || 'Student'
    return (
      <RealDataEmpty
        title={`Welcome, ${name}`}
        description="Your student portal is ready, but no real academic record is linked to your account yet. Ask a teacher/admin to add a student record with the same name or email used for this login; then strengths, weaknesses, study plans, mastery maps, motivation, and career guidance will populate from real data."
        mode="student"
        userProfile={userProfile}
        currentUser={currentUser}
        recordCount={recordCount}
      />
    )
  }

  const student = buildStudentProfile(linkedStudent)
  const strengths = student.mastery.filter((item) => item.score >= 70)
  const weaknesses = student.mastery.filter((item) => item.score < 70)

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <section className="glass-card">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-white">{student.name}</h2>
            <p className="mt-1 text-sm text-slate-400">Learning DNA: {student.learningStyle}</p>
          </div>
          <StatusBadge riskLevel={student.risk} />
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <MetricCard label="Growth Score" value={student.growthScore} icon={TrendingUp} tone="text-emerald-100" />
          <MetricCard label="Confidence" value={`${student.confidence}%`} icon={HeartPulse} tone="text-rose-100" />
          <MetricCard label="Streak" value="7 days" icon={Sparkles} tone="text-amber-100" />
        </div>
        <div className="mt-5 rounded-lg border border-white/10 bg-black/20 p-4">
          <p className="text-sm font-semibold text-cyan-100">AI Study Coach</p>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            You are weakest in {student.weakest.label}. Complete {student.weakest.concepts[1]} first, then take three micro-quizzes before moving to {student.secondWeakest.label}.
          </p>
        </div>
        <div className="mt-5 rounded-lg border border-white/10 bg-black/20 p-4">
          <ResourceLinks resources={student.resources} />
          {!student.resources?.length && (
            <p className="text-sm leading-6 text-slate-300">
              No web sources are attached yet. Ask your teacher to add or re-run your student analysis after the Tavily key is saved in backend env.
            </p>
          )}
        </div>
        <div className="mt-5">
          <ReportCardPanel student={student} compact />
        </div>
        <div className="mt-5">
          <TimetablePanel student={student} compact />
        </div>
        <div className="mt-5">
          <WorldComparisonPanel student={student} compact />
        </div>
        <div className="mt-5">
          <ProjectUploadPanel student={student} onProjectSaved={onProjectSaved} compact />
        </div>
        <div className="mt-5">
          <ContributionGraph student={student} compact />
        </div>
        <div className="mt-5">
          <OpportunityPanel student={student} onLocationSaved={onProjectSaved} compact />
        </div>
      </section>

      <section className="glass-card">
        <h2 className="mb-5 text-xl font-bold text-white">Concept Mastery Map</h2>
        <div className="space-y-4">
          {student.mastery.map((item) => (
            <div key={item.subject}>
              <div className="mb-2 flex justify-between text-sm">
                <span className="font-semibold text-slate-200">{item.subject}: {item.concept}</span>
                <span className="text-slate-400">{item.mastery}%</span>
              </div>
              <div className="h-3 rounded-full bg-white/10">
                <div className="h-3 rounded-full bg-cyan-300" style={{ width: `${item.mastery}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold text-emerald-100">Strengths</p>
            <p className="mt-2 text-sm text-slate-300">{strengths.map((item) => item.subject).join(', ') || 'Consistency and recovery readiness'}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-rose-100">Weaknesses</p>
            <p className="mt-2 text-sm text-slate-300">{weaknesses.map((item) => item.concept).join(', ')}</p>
          </div>
        </div>
      </section>
    </div>
  )
}

function ParentView({ linkedChildren, userProfile, currentUser, recordCount }) {
  if (!linkedChildren.length) {
    const name = userProfile?.name || currentUser?.displayName || 'Parent'
    return (
      <RealDataEmpty
        title={`Welcome, ${name}`}
        description="Your parent portal is ready, but no child record is linked to your account yet. Ask a teacher/admin to add your child with your parent email; then progress, attendance patterns, risk guidance, report narratives, and parent action steps will populate from real data only."
        mode="parent"
        userProfile={userProfile}
        currentUser={currentUser}
        recordCount={recordCount}
      />
    )
  }

  const children = linkedChildren.map(buildStudentProfile).sort((a, b) => b.riskScore - a.riskScore)

  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-2">
        {children.map((student) => (
          <article key={student.id} className="glass-card">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">{student.name}</h2>
                <p className="text-sm text-slate-400">Attendance {student.attendance}% - Average {student.average}%</p>
              </div>
              <StatusBadge riskLevel={student.risk} />
            </div>
            <p className="text-sm leading-6 text-slate-300">
              Your child shows {student.risk === 'High' ? 'increasing difficulty' : 'manageable pressure'} in {student.weakest.label.toLowerCase()} comprehension.
              The main signs are: {student.reasons.join(', ')}.
            </p>
            <p className="mt-4 rounded-lg border border-white/10 bg-white/[0.05] p-4 text-sm leading-6 text-slate-200">
              Parent guidance: keep a fixed 25-minute revision window, ask your child to explain one concept aloud, and check completion of the recovery task twice this week.
            </p>
          </article>
        ))}
      </div>

      <StudentActivityFeed students={children} />
      <div className="grid gap-5 xl:grid-cols-2">
        {children.map((student) => (
          <ContributionGraph key={student.id} student={student} compact />
        ))}
      </div>
    </div>
  )
}

function AdminView({ intelligence, userProfile, currentUser }) {
  if (!intelligence.students.length) {
    return (
      <RealDataEmpty
        title="No school records available"
        description="Admin analytics need real student records before department performance, class comparisons, teacher effectiveness, recovery intelligence, scholarship flags, and institution heatmaps can be calculated."
        mode="admin"
        userProfile={userProfile}
        currentUser={currentUser}
        recordCount={intelligence.students.length}
      />
    )
  }

  const departmentRows = intelligence.subjectAverages.map((item, index) => ({
    ...item,
    teacherEffectiveness: clamp(item.average + 9 - index * 3),
    interventionSuccess: clamp(item.average + 14),
  }))

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="School-wide Average" value={`${intelligence.schoolAverage}%`} icon={BarChart3} />
        <MetricCard label="Department Gap" value={intelligence.gapTrend.subject} icon={BookOpenCheck} tone="text-amber-100" />
        <MetricCard label="Teacher Effectiveness" value={`${clamp(intelligence.schoolAverage + 8)}%`} icon={Users} tone="text-emerald-100" />
        <MetricCard label="Recovery Rate" value={`${intelligence.interventionSuccess}%`} icon={TrendingUp} tone="text-cyan-100" />
      </div>
      <section className="glass-card">
        <h2 className="mb-5 text-xl font-bold text-white">Department Performance and Intervention Success</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={departmentRows}>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
              <XAxis dataKey="subject" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" domain={[0, 100]} />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)' }} />
              <Bar dataKey="average" fill="#67e8f9" radius={[6, 6, 0, 0]} />
              <Bar dataKey="teacherEffectiveness" fill="#34d399" radius={[6, 6, 0, 0]} />
              <Bar dataKey="interventionSuccess" fill="#fbbf24" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  )
}

function PredictionView({ intelligence, userProfile, currentUser }) {
  if (!intelligence.students.length) {
    return (
      <RealDataEmpty
        title="Prediction engine waiting for real records"
        description="Academic decline, dropout probability, subject failure risk, explainable AI reasons, intervention success likelihood, and digital twin simulations require actual student score and attendance records."
        mode="prediction"
        userProfile={userProfile}
        currentUser={currentUser}
        recordCount={intelligence.students.length}
      />
    )
  }

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {intelligence.urgent.map((student) => (
        <article key={student.id} className="glass-card">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white">{student.name}</h2>
              <p className="text-sm text-slate-400">Educational digital twin simulation</p>
            </div>
            <StatusBadge riskLevel={student.risk} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <MetricCard label="Academic Decline" value={`${student.riskScore}%`} icon={AlertTriangle} tone="text-rose-100" />
            <MetricCard label="Dropout Probability" value={`${student.dropout}%`} icon={ShieldCheck} tone="text-amber-100" />
            <MetricCard label="Subject Failure Risk" value={`${student.failure}%`} icon={BookOpenCheck} tone="text-rose-100" />
            <MetricCard label="Intervention Success" value={`${student.interventionSuccess}%`} icon={TrendingUp} tone="text-emerald-100" />
          </div>
          <p className="mt-5 text-sm font-semibold text-cyan-100">Explainable AI</p>
          <p className="mt-2 text-sm leading-6 text-slate-300">Risk increased because {student.reasons.join(', ')}.</p>
          <p className="mt-4 rounded-lg border border-white/10 bg-black/20 p-4 text-sm leading-6 text-slate-200">
            If intervention is delayed 6 months, projected mastery drops to {clamp(student.average - student.riskScore * 0.18)}%.
            With weekly recovery, projected mastery rises to {student.trajectory.at(-1).score}%.
          </p>
        </article>
      ))}
    </div>
  )
}

function CopilotView({ intelligence, userProfile, currentUser }) {
  const topStudent = intelligence.urgent[0]

  if (!topStudent) {
    return (
      <RealDataEmpty
        title="Academic copilot needs live student data"
        description="The copilot will generate remediation strategies, report narratives, OCR extraction summaries, voice-command answers, and learning paths after real student records are present."
        mode="copilot"
        userProfile={userProfile}
        currentUser={currentUser}
        recordCount={intelligence.students.length}
      />
    )
  }

  return (
    <div className="space-y-6">
      <section className="glass-card">
        <div className="mb-5 flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-lg bg-cyan-300 text-slate-950">
            <Bot size={22} />
          </span>
          <div>
            <h2 className="text-xl font-bold text-white">Academic Copilot</h2>
            <p className="text-sm text-slate-400">Teacher-facing intelligence answers generated from the cohort signals.</p>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {copilotQuestions.map((question) => (
            <button key={question} type="button" className="secondary-button justify-start text-left">
              <Sparkles size={17} />
              {question}
            </button>
          ))}
        </div>
        <div className="mt-5 rounded-lg border border-cyan-300/20 bg-cyan-300/10 p-4">
          <p className="text-sm font-semibold text-cyan-100">Generated remediation strategy</p>
          <p className="mt-2 text-sm leading-6 text-slate-200">
            Prioritize {topStudent.name}, rebuild {topStudent.weakest.concepts[1]}, schedule mentor support on Tuesday and Friday, generate three quizzes, and notify parents with attendance-linked guidance.
          </p>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Report Cards" value="Auto narratives" icon={FileText} />
        <MetricCard label="Learning Paths" value="Adaptive" icon={Target} tone="text-emerald-100" />
        <MetricCard label="Timetable AI" value="Optimized" icon={CalendarClock} tone="text-amber-100" />
        <MetricCard label="National Analytics" value="Future-ready" icon={Network} tone="text-cyan-100" />
      </div>
    </div>
  )
}

function TrajectoryPanel({ intelligence }) {
  if (!intelligence.urgent[0]) {
    return (
      <RealDataEmpty
        title="No trajectory graph yet"
        description="Add a real student record to generate a trajectory from actual score and attendance signals."
      />
    )
  }

  return (
    <section className="glass-card">
      <h2 className="mb-5 text-xl font-bold text-white">Student Trajectory Graphs</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={intelligence.urgent[0].trajectory}>
            <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
            <XAxis dataKey="week" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" domain={[0, 100]} />
            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)' }} />
            <Line type="monotone" dataKey="score" stroke="#67e8f9" strokeWidth={3} dot={{ fill: '#67e8f9' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}

function SubjectPanel({ intelligence }) {
  return (
    <section className="glass-card">
      <h2 className="mb-5 text-xl font-bold text-white">Subject-wise Analytics</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={intelligence.subjectAverages}>
            <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
            <XAxis dataKey="subject" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" domain={[0, 100]} />
            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)' }} />
            <Bar dataKey="average" radius={[6, 6, 0, 0]}>
              {intelligence.subjectAverages.map((entry) => (
                <Cell key={entry.subject} fill={entry.average < 60 ? '#fb7185' : entry.average < 75 ? '#fbbf24' : '#34d399'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}

function FeatureGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {featureTiles.map((feature) => {
        const Icon = feature.icon
        return (
          <article key={feature.label} className="glass-card">
            <Icon className="mb-4 text-cyan-100" size={24} />
            <h3 className="font-bold text-white">{feature.label}</h3>
            <p className="mt-2 text-sm text-slate-400">{feature.value}</p>
          </article>
        )
      })}
    </div>
  )
}

function IntelligenceSuite({ mode = 'teacher' }) {
  const location = useLocation()
  const { students, loading, error, refresh } = useStudents()
  const { currentUser, userProfile } = useAuth()
  const teacherEmail = currentUser?.email?.trim().toLowerCase()
  const teacherScopedModes = ['teacher', 'prediction', 'copilot']
  const visibleStudents = teacherScopedModes.includes(mode)
    ? students.filter((student) => !student.teacherEmail || student.teacherEmail === teacherEmail)
    : students
  const intelligence = buildCohortIntelligence(visibleStudents)
  const linkedStudent = findStudentForUser(students, userProfile, currentUser)
  const linkedChildren = findChildrenForUser(students, userProfile, currentUser)
  const copy = portalCopy[mode] || portalCopy.teacher
  const focusKey = location.pathname.split('/').filter(Boolean).at(-1)
  const focus = routeFocus[focusKey]
  const View =
    mode === 'student'
      ? StudentView
      : mode === 'parent'
        ? ParentView
        : mode === 'admin'
          ? AdminView
          : mode === 'prediction'
            ? PredictionView
            : mode === 'copilot'
              ? CopilotView
              : TeacherView

  return (
    <>
      <PageHeader eyebrow={copy.eyebrow} title={copy.title} description={copy.description} />

      {error && <div className="mb-6 rounded-lg border border-rose-300/20 bg-rose-400/10 p-4 text-rose-100">{error}</div>}
      {!students.length && !loading && mode !== 'student' && mode !== 'parent' && (
        <div className="mb-6 rounded-lg border border-cyan-300/20 bg-cyan-300/10 p-4 text-sm text-cyan-50">
          Only real student records are shown. Add records to activate these analytics.
        </div>
      )}

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <FocusBanner focus={focus} />
        <View
          intelligence={intelligence}
          linkedStudent={linkedStudent}
          linkedChildren={linkedChildren}
          userProfile={userProfile}
          currentUser={currentUser}
          recordCount={visibleStudents.length}
          onProjectSaved={refresh}
        />
        {(mode === 'teacher' || mode === 'prediction') && intelligence.students.length > 0 && (
          <div className="grid gap-6 xl:grid-cols-2">
            <SubjectPanel intelligence={intelligence} />
            <TrajectoryPanel intelligence={intelligence} />
          </div>
        )}
        {(mode === 'teacher' || mode === 'copilot') && <FeatureGrid />}
      </motion.div>
    </>
  )
}

export default IntelligenceSuite
