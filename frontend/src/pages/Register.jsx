import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AlertCircle, CheckCircle2, Mail, Phone, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

function Register() {
  const navigate = useNavigate()
  const { register, verifyCurrentUser } = useAuth()
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '' })
  const [verificationSent, setVerificationSent] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      await register(form)
      setVerificationSent(true)
      setMessage('Verification email sent. Open your inbox, verify the address, then return here.')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleVerified = async () => {
    setLoading(true)
    setError('')

    try {
      await verifyCurrentUser()
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="grid min-h-[calc(100vh-153px)] place-items-center px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl">
        <div className="glass-panel rounded-lg p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-200">Teacher onboarding</p>
          <h1 className="mt-3 text-3xl font-black text-white">Create your AstraLearn account</h1>
          <p className="mt-2 text-sm text-slate-400">
            Firebase Auth creates your account and requires email verification before dashboard access.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 grid gap-4 md:grid-cols-2">
            <label>
              <span className="mb-2 block text-sm font-semibold text-slate-200">Name</span>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  className="field pl-10"
                  required
                  value={form.name}
                  onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                  placeholder="Ananya Rao"
                />
              </div>
            </label>

            <label>
              <span className="mb-2 block text-sm font-semibold text-slate-200">Phone Number</span>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  className="field pl-10"
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
                  placeholder="+91 98765 43210"
                />
              </div>
            </label>

            <label>
              <span className="mb-2 block text-sm font-semibold text-slate-200">Email</span>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  className="field pl-10"
                  required
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                  placeholder="teacher@school.edu"
                />
              </div>
            </label>

            <label>
              <span className="mb-2 block text-sm font-semibold text-slate-200">Password</span>
              <input
                className="field"
                required
                minLength={6}
                type="password"
                value={form.password}
                onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                placeholder="Minimum 6 characters"
              />
            </label>

            {message && (
              <div className="md:col-span-2 flex gap-2 rounded-lg border border-emerald-300/20 bg-emerald-400/10 p-3 text-sm text-emerald-100">
                <CheckCircle2 className="mt-0.5 shrink-0" size={16} />
                {message}
              </div>
            )}

            {error && (
              <div className="md:col-span-2 flex gap-2 rounded-lg border border-rose-300/20 bg-rose-400/10 p-3 text-sm text-rose-100">
                <AlertCircle className="mt-0.5 shrink-0" size={16} />
                {error}
              </div>
            )}

            <button className="primary-button md:col-span-2" disabled={loading || verificationSent}>
              {loading ? 'Creating account...' : 'Register and Send Verification'}
            </button>
          </form>

          {verificationSent && (
            <button type="button" onClick={handleVerified} className="secondary-button mt-4 w-full" disabled={loading}>
              {loading ? 'Reloading Firebase user...' : 'I Have Verified'}
            </button>
          )}

          <p className="mt-6 text-center text-sm text-slate-400">
            Already registered?{' '}
            <Link to="/login" className="font-semibold text-cyan-200 hover:text-cyan-100">
              Login
            </Link>
          </p>
        </div>
      </motion.div>
    </section>
  )
}

export default Register
