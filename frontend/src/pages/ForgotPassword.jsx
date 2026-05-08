import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AlertCircle, CheckCircle2, Mail } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

function ForgotPassword() {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    const cleanEmail = email.trim().toLowerCase()
    setLoading(true)
    setError('')
    setStatus('')

    try {
      await resetPassword(cleanEmail)
      setEmail(cleanEmail)
      setStatus(`Password reset email sent to ${cleanEmail}. Check your inbox and spam folder.`)
    } catch (err) {
      setError(getResetErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="grid min-h-[calc(100vh-153px)] place-items-center px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="glass-panel rounded-lg p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-200">Account recovery</p>
          <h1 className="mt-3 text-3xl font-black text-white">Reset password</h1>
          <p className="mt-2 text-sm text-slate-400">Firebase will email a secure password reset link.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <label>
              <span className="mb-2 block text-sm font-semibold text-slate-200">Email</span>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  className="field pl-10"
                  required
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="teacher@school.edu"
                />
              </div>
            </label>

            {status && (
              <div className="flex gap-2 rounded-lg border border-emerald-300/20 bg-emerald-400/10 p-3 text-sm text-emerald-100">
                <CheckCircle2 className="mt-0.5 shrink-0" size={16} />
                {status}
              </div>
            )}

            {error && (
              <div className="flex gap-2 rounded-lg border border-rose-300/20 bg-rose-400/10 p-3 text-sm text-rose-100">
                <AlertCircle className="mt-0.5 shrink-0" size={16} />
                {error}
              </div>
            )}

            <button className="primary-button w-full" disabled={loading}>
              {loading ? 'Sending reset link...' : 'Send Password Reset Email'}
            </button>
          </form>

          <Link to="/login" className="secondary-button mt-4 w-full">
            Back to Login
          </Link>
        </div>
      </motion.div>
    </section>
  )
}

export default ForgotPassword

function getResetErrorMessage(error) {
  const code = error?.code || ''
  const message = error?.message || ''

  if (code.includes('auth/invalid-email')) {
    return 'Enter a valid email address.'
  }

  if (code.includes('auth/user-not-found')) {
    return 'No AstraLearn account exists with this email.'
  }

  if (code.includes('auth/too-many-requests')) {
    return 'Too many reset attempts. Please wait a few minutes and try again.'
  }

  if (code.includes('auth/unauthorized-continue-uri') || code.includes('auth/invalid-continue-uri')) {
    return 'This app URL is not allowed in Firebase Auth. Add this localhost/deployed domain in Firebase Authentication authorized domains.'
  }

  if (message.toLowerCase().includes('network')) {
    return 'Network error while sending the reset link. Please check your connection and try again.'
  }

  return message || 'Unable to send password reset email right now.'
}
