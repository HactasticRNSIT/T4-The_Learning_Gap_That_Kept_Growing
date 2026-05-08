import { NavLink } from 'react-router-dom'
import { Sparkles } from 'lucide-react'

function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <NavLink to="/home" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-cyan-300 text-slate-950 shadow-glow">
            <Sparkles size={20} />
          </span>
          <span className="text-lg font-black tracking-wide">AstraLearn</span>
        </NavLink>

        <nav className="flex items-center gap-3">
          <NavLink to="/login" className="secondary-button px-4 py-2">
            Login
          </NavLink>
          <NavLink to="/register" className="primary-button px-4 py-2">
            Register
          </NavLink>
        </nav>
      </div>
    </header>
  )
}

export default Navbar
