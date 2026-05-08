import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  AlertTriangle,
  Award,
  BarChart3,
  BookOpenCheck,
  Bot,
  Brain,
  CalendarClock,
  FileText,
  FolderUp,
  GitBranch,
  GraduationCap,
  HeartPulse,
  LayoutDashboard,
  LogOut,
  Menu,
  PlusCircle,
  School,
  Sparkles,
  Globe2,
  Target,
  TrendingUp,
  Upload,
  Users,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { roles } from '../utils/roles'

const portalThemes = {
  teacher: {
    name: 'Teacher Intelligence Portal',
    subtitle: 'Classroom AI Command Center',
    badge: 'bg-cyan-300 text-slate-950',
    active: 'bg-cyan-300 text-slate-950 shadow-glow',
  },
  student: {
    name: 'Student Growth Portal',
    subtitle: 'Personal Study Coach',
    badge: 'bg-emerald-300 text-slate-950',
    active: 'bg-emerald-300 text-slate-950',
  },
  parent: {
    name: 'Parent Guidance Portal',
    subtitle: 'Progress and Care Signals',
    badge: 'bg-amber-300 text-slate-950',
    active: 'bg-amber-300 text-slate-950',
  },
  admin: {
    name: 'School Admin Portal',
    subtitle: 'Institution Intelligence',
    badge: 'bg-sky-300 text-slate-950',
    active: 'bg-sky-300 text-slate-950',
  },
}

const navByRole = {
  teacher: [
    { label: 'Core Dashboard', path: '/teacher', icon: LayoutDashboard, end: true },
    { label: 'Students', path: '/teacher/students', icon: Users },
    { label: 'Add Student', path: '/teacher/add-student', icon: PlusCircle },
    { label: 'Learning Gaps', path: '/teacher/learning-gaps', icon: GraduationCap },
    { label: 'Risk Alerts', path: '/teacher/risk-alerts', icon: AlertTriangle },
    { label: 'Prediction Engine', path: '/teacher/prediction-engine', icon: TrendingUp },
    { label: 'Academic Copilot', path: '/teacher/academic-copilot', icon: Bot },
    { label: 'Feature Lab', path: '/teacher/features', icon: Sparkles },
  ],
  student: [
    { label: 'My Dashboard', path: '/student', icon: LayoutDashboard, end: true },
    { label: 'Study Coach', path: '/student/study-coach', icon: Brain },
    { label: 'Timetable', path: '/student/timetable', icon: CalendarClock },
    { label: 'Mastery Map', path: '/student/mastery-map', icon: Target },
    { label: 'Motivation', path: '/student/motivation', icon: HeartPulse },
    { label: 'Projects', path: '/student/projects', icon: FolderUp },
    { label: 'Contributions', path: '/student/contributions', icon: GitBranch },
    { label: 'World Rank', path: '/student/world-comparison', icon: Globe2 },
    { label: 'Career Guide', path: '/student/career-guide', icon: GraduationCap },
    { label: 'Opportunities', path: '/student/opportunities', icon: Award },
    { label: 'Feature Lab', path: '/student/features', icon: Sparkles },
  ],
  parent: [
    { label: 'Child Progress', path: '/parent', icon: LayoutDashboard, end: true },
    { label: 'Risk Guidance', path: '/parent/risk-guidance', icon: AlertTriangle },
    { label: 'Attendance', path: '/parent/attendance', icon: CalendarClock },
    { label: 'Contributions', path: '/parent/contributions', icon: GitBranch },
    { label: 'Parent Reports', path: '/parent/reports', icon: FileText },
    { label: 'Feature Lab', path: '/parent/features', icon: Sparkles },
  ],
  admin: [
    { label: 'School Analytics', path: '/admin', icon: School, end: true },
    { label: 'Departments', path: '/admin/departments', icon: BarChart3 },
    { label: 'Interventions', path: '/admin/interventions', icon: BookOpenCheck },
    { label: 'Document AI', path: '/admin/document-ai', icon: Upload },
    { label: 'National Scale', path: '/admin/national-scale', icon: TrendingUp },
    { label: 'Feature Lab', path: '/admin/features', icon: Sparkles },
  ],
}

function PortalLayout({ role }) {
  const { currentUser, userProfile, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const theme = portalThemes[role]
  const navItems = navByRole[role]

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const sidebar = (
    <aside className="flex h-full flex-col border-r border-white/10 bg-slate-950/95 p-5 backdrop-blur-xl">
      <div className="mb-8 flex items-center justify-between">
        <NavLink to={roles[role].path} className="flex items-center gap-3">
          <span className={`grid h-11 w-11 place-items-center rounded-lg ${theme.badge}`}>
            <Sparkles size={22} />
          </span>
          <div>
            <p className="text-base font-black tracking-wide text-white">{theme.name}</p>
            <p className="text-xs text-slate-400">{theme.subtitle}</p>
          </div>
        </NavLink>
        <button
          type="button"
          className="secondary-button px-3 py-2 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close navigation"
        >
          <X size={18} />
        </button>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition ${
                  isActive ? theme.active : 'text-slate-300 hover:bg-white/[0.07] hover:text-white'
                }`
              }
            >
              <Icon size={18} />
              {item.label}
            </NavLink>
          )
        })}
      </nav>

      <div className="mt-auto rounded-lg border border-white/10 bg-white/[0.05] p-4">
        <div className="mb-4">
          <p className="truncate text-sm font-bold text-white">{userProfile?.name || currentUser?.displayName || roles[role].label}</p>
          <p className="truncate text-xs text-slate-400">{currentUser?.email}</p>
          <p className="mt-2 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-200">
            {roles[role].label}
          </p>
        </div>
        <button type="button" onClick={handleLogout} className="secondary-button w-full justify-center">
          <LogOut size={17} />
          Logout
        </button>
      </div>
    </aside>
  )

  return (
    <div className="min-h-screen bg-ink text-white">
      <div className="lg:hidden">
        <div className="fixed inset-x-0 top-0 z-30 flex items-center justify-between border-b border-white/10 bg-slate-950/90 px-4 py-3 backdrop-blur-xl">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="secondary-button px-3 py-2"
            aria-label="Open navigation"
          >
            <Menu size={18} />
          </button>
          <span className="text-sm font-black tracking-wide">{theme.name}</span>
          <span className="h-10 w-10" />
        </div>
      </div>

      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] transform transition lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:block`}
      >
        {sidebar}
      </div>

      <main className="px-4 pb-8 pt-24 lg:ml-80 lg:px-8 lg:pt-8">
        <Outlet />
      </main>
    </div>
  )
}

export default PortalLayout
