import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  AlertTriangle,
  BarChart3,
  Brain,
  Bot,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  PlusCircle,
  School,
  Sparkles,
  TrendingUp,
  Users,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

const navItems = [
  { label: 'Overview', path: '/dashboard', icon: LayoutDashboard, end: true },
  { label: 'Students', path: '/dashboard/students', icon: Users },
  { label: 'Add Student', path: '/dashboard/add-student', icon: PlusCircle },
  { label: 'AI Insights', path: '/dashboard/ai-insights', icon: Brain },
  { label: 'Learning Gaps', path: '/dashboard/learning-gaps', icon: GraduationCap },
  { label: 'Risk Alerts', path: '/dashboard/risk-alerts', icon: AlertTriangle },
  { label: 'Teacher Intel', path: '/dashboard/teacher-intelligence', icon: BarChart3 },
  { label: 'Student Portal', path: '/dashboard/student-portal', icon: GraduationCap },
  { label: 'Parent Portal', path: '/dashboard/parent-portal', icon: Users },
  { label: 'Admin Portal', path: '/dashboard/admin-portal', icon: School },
  { label: 'Prediction Engine', path: '/dashboard/prediction-engine', icon: TrendingUp },
  { label: 'Academic Copilot', path: '/dashboard/academic-copilot', icon: Bot },
]

function DashboardLayout() {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const sidebar = (
    <aside className="flex h-full flex-col border-r border-white/10 bg-slate-950/95 p-5 backdrop-blur-xl">
      <div className="mb-8 flex items-center justify-between">
        <NavLink to="/dashboard" className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-lg bg-cyan-300 text-slate-950 shadow-glow">
            <Sparkles size={22} />
          </span>
          <div>
            <p className="text-lg font-black tracking-wide">AstraLearn</p>
            <p className="text-xs text-slate-400">Risk Intelligence OS</p>
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
                  isActive
                    ? 'bg-cyan-300 text-slate-950 shadow-glow'
                    : 'text-slate-300 hover:bg-white/[0.07] hover:text-white'
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
        <div className="mb-4 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-300 text-slate-950">
            <BarChart3 size={20} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold">{currentUser?.displayName || 'Teacher'}</p>
            <p className="truncate text-xs text-slate-400">{currentUser?.email}</p>
          </div>
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
          <span className="text-sm font-black tracking-wide">AstraLearn</span>
          <span className="h-10 w-10" />
        </div>
      </div>

      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
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

export default DashboardLayout
