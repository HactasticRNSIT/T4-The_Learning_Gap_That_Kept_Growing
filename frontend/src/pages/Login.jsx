import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AlertCircle, Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(location.state?.message || '')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      await login(form.email, form.password)
      navigate(location.state?.from?.pathname || '/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="grid min-h-[calc(100vh-153px)] place-items-center px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="glass-panel rounded-lg p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-200">Secure access</p>
          <h1 className="mt-3 text-3xl font-black text-white">Login to AstraLearn</h1>
          <p className="mt-2 text-sm text-slate-400">Verified teacher accounts can access the dashboard.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-200">Email</span>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  className="field pl-10"
                  type="email"
                  required
                  value={form.email}
                  onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                  placeholder="teacher@school.edu"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-200">Password</span>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  className="field pl-10 pr-11"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                  placeholder="Your password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>

            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-sm font-semibold text-cyan-200 hover:text-cyan-100">
                Forgot password?
              </Link>
            </div>

            {error && (
              <div className="flex gap-2 rounded-lg border border-rose-300/20 bg-rose-400/10 p-3 text-sm text-rose-100">
                <AlertCircle className="mt-0.5 shrink-0" size={16} />
                {error}
              </div>
            )}

            <button className="primary-button w-full" disabled={loading}>
              {loading ? 'Checking verification...' : 'Login'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            New to AstraLearn?{' '}
            <Link to="/register" className="font-semibold text-cyan-200 hover:text-cyan-100">
              Register
            </Link>
          </p>
        </div>
      </motion.div>
    </section>
  )
}

export default Login
