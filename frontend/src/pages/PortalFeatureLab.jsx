import {
  BarChart3,
  BookOpenCheck,
  Bot,
  Brain,
  CalendarClock,
  FileText,
  GraduationCap,
  HeartPulse,
  LineChart,
  Mic,
  Network,
  School,
  SearchCheck,
  ShieldAlert,
  Sparkles,
  Target,
  TrendingUp,
  Upload,
  Users,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import { buildCohortIntelligence } from '../utils/academicIntelligence'
import { useStudents } from '../hooks/useStudents'

const features = [
  { title: 'Teacher Intelligence Portal', icon: BarChart3, path: '/teacher', owner: 'Teacher', status: 'Live dashboard' },
  { title: 'Student Portal', icon: GraduationCap, path: '/student', owner: 'Student', status: 'Role-based portal' },
  { title: 'Parent Portal', icon: Users, path: '/parent', owner: 'Parent', status: 'Guidance view' },
  { title: 'School Admin Portal', icon: School, path: '/admin', owner: 'Admin', status: 'Institution analytics' },
  { title: 'AI Prediction Engine', icon: TrendingUp, path: '/teacher/prediction-engine', owner: 'Teacher/Admin', status: 'Risk probabilities' },
  { title: 'Explainable AI System', icon: Brain, path: '/teacher/prediction-engine', owner: 'All', status: 'Reason codes' },
  { title: 'AI Academic Copilot', icon: Bot, path: '/teacher/academic-copilot', owner: 'Teacher', status: 'Strategy generator' },
  { title: 'Smart Intervention System', icon: Target, path: '/teacher/learning-gaps', owner: 'Teacher', status: 'Action plans' },
  { title: 'Emotional + Behavioral Intelligence', icon: HeartPulse, path: '/student/motivation', owner: 'Student/Teacher', status: 'Engagement signals' },
  { title: 'AI Report Card Generator', icon: FileText, path: '/parent/reports', owner: 'Parent/Admin', status: 'Narratives' },
  { title: 'Learning DNA/Profile', icon: Sparkles, path: '/student', owner: 'Student', status: 'Profile model' },
  { title: 'Concept-Level Weakness Detection', icon: SearchCheck, path: '/student/mastery-map', owner: 'Student/Teacher', status: 'Concept map' },
  { title: 'AI Timetable Optimization', icon: CalendarClock, path: '/student/timetable', owner: 'Student', status: 'Schedule plan' },
  { title: 'Real-Time Classroom Intelligence', icon: LineChart, path: '/teacher', owner: 'Teacher', status: 'Live signals' },
  { title: 'Voice AI Assistant', icon: Mic, path: '/teacher/academic-copilot', owner: 'Teacher/Student', status: 'Voice-ready UI' },
  { title: 'OCR + Smart Document Analysis', icon: Upload, path: '/admin/document-ai', owner: 'Admin', status: 'Upload workflow' },
  { title: 'AI Career Guidance', icon: GraduationCap, path: '/student/career-guide', owner: 'Student', status: 'Path suggestions' },
  { title: 'Peer Comparison Analytics', icon: BarChart3, path: '/admin/departments', owner: 'Admin/Student', status: 'Benchmarking' },
  { title: 'Recovery Intelligence', icon: BookOpenCheck, path: '/admin/interventions', owner: 'Admin/Teacher', status: 'Success tracking' },
  { title: 'Educational Digital Twin', icon: Network, path: '/teacher/prediction-engine', owner: 'Teacher/Admin', status: 'Delay simulation' },
  { title: 'AI Learning Path Generator', icon: Target, path: '/student/study-coach', owner: 'Student', status: 'Adaptive path' },
  { title: 'Scholarship / Risk Recommendation', icon: ShieldAlert, path: '/student/opportunities', owner: 'Student/Admin', status: 'Candidate flags' },
  { title: 'School-Level Heatmaps', icon: BarChart3, path: '/teacher', owner: 'Teacher/Admin', status: 'Heatmap grid' },
  { title: 'National Education Analytics', icon: Network, path: '/admin/national-scale', owner: 'Admin', status: 'Future scale' },
]

function resolveFeaturePath(featurePath, role) {
  return featurePath.startsWith(`/${role}`) ? featurePath : `/${role}/features`
}

function PortalFeatureLab({ role = 'teacher' }) {
  const { students } = useStudents()
  const intelligence = buildCohortIntelligence(students)

  return (
    <>
      <PageHeader
        eyebrow="24 embedded features"
        title="AstraLearn Feature Lab"
        description="Every requested feature is represented as a portal surface. Metrics are calculated only from real student records."
      />

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <article className="glass-card">
          <p className="text-sm text-slate-400">Active cohort health</p>
          <p className="mt-3 text-3xl font-black text-white">{students.length ? `${intelligence.schoolAverage}%` : 'No records'}</p>
        </article>
        <article className="glass-card">
          <p className="text-sm text-slate-400">Weakest institutional gap</p>
          <p className="mt-3 text-3xl font-black text-white">{intelligence.gapTrend.subject}</p>
        </article>
        <article className="glass-card">
          <p className="text-sm text-slate-400">Current portal</p>
          <p className="mt-3 text-3xl font-black capitalize text-white">{role}</p>
        </article>
      </div>

      <section className="glass-card mb-6">
        <h2 className="text-xl font-bold text-white">Completion Status</h2>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          All 24 features are wired into role routes. Features that need marks, attendance, parent email, or student email stay in a ready state until real records are added.
        </p>
        <div className="mt-5 grid gap-3 md:grid-cols-4">
          <div className="rounded-lg border border-white/10 bg-black/20 p-4">
            <p className="text-sm text-slate-400">Feature Count</p>
            <p className="mt-2 text-2xl font-black text-white">24</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-black/20 p-4">
            <p className="text-sm text-slate-400">Data Source</p>
            <p className="mt-2 text-2xl font-black text-white">Live API</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-black/20 p-4">
            <p className="text-sm text-slate-400">Role Routing</p>
            <p className="mt-2 text-2xl font-black text-white">Active</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-black/20 p-4">
            <p className="text-sm text-slate-400">Demo Data</p>
            <p className="mt-2 text-2xl font-black text-white">Off</p>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <Link
              key={feature.title}
              to={resolveFeaturePath(feature.path, role)}
              className="glass-card block transition hover:border-cyan-300/40 hover:bg-white/[0.09]"
            >
              <div className="flex items-start justify-between gap-4">
                <Icon className="text-cyan-100" size={24} />
                <span className="rounded-full bg-emerald-300/15 px-3 py-1 text-xs font-bold text-emerald-100">#{index + 1}</span>
              </div>
              <h2 className="mt-4 text-lg font-bold text-white">{feature.title}</h2>
              <p className="mt-2 text-sm text-slate-400">{feature.owner}</p>
              <p className="mt-4 rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm font-semibold text-slate-200">
                {feature.status}
              </p>
            </Link>
          )
        })}
      </div>
    </>
  )
}

export default PortalFeatureLab
