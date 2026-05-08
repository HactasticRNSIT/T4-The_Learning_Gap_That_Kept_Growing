import React, { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase/firebase'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, LogIn, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react'

const Login = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ text: '', type: '' })

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      if (!userCredential.user.emailVerified) {
        setMessage({ text: 'Please verify your email before login.', type: 'error' })
        setLoading(false)
        return
      }
      setMessage({ text: 'Access Granted. Redirecting...', type: 'success' })
      setTimeout(() => navigate('/dashboard'), 1500)
    } catch (error) {
      setMessage({ text: error.message, type: 'error' })
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#020617] px-6 text-white selection:bg-primary/30">
      {/* Background Orbital Effect */}
      <div className="absolute h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="group rounded-[2.5rem] border border-white/10 bg-white/5 p-10 backdrop-blur-2xl transition-all duration-500 hover:border-white/20">
          
          <div className="mb-10 text-center">
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20"
            >
              <LogIn size={32} />
            </motion.div>
            <h1 className="text-4xl font-black tracking-tighter">Welcome Back</h1>
            <p className="mt-2 text-slate-400">Secure access to your terminal</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Field */}
            <div className="relative group/input">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 transition-colors group-focus-within/input:text-primary" size={20} />
              <input
                type="email"
                required
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-white/5 bg-slate-950/50 py-4 pl-12 pr-4 outline-none transition-all focus:border-primary/50 focus:ring-1 focus:ring-primary/50"
              />
            </div>

            {/* Password Field with Eye Toggle */}
            <div className="relative group/input">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 transition-colors group-focus-within/input:text-primary" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Security Key"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-white/5 bg-slate-950/50 py-4 pl-12 pr-12 outline-none transition-all focus:border-primary/50 focus:ring-1 focus:ring-primary/50"
              />
              
              {/* Animated Eye Button */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
              >
                <motion.div
                  initial={false}
                  animate={{ scale: password.length > 0 ? 1 : 0.8, opacity: password.length > 0 ? 1 : 0.5 }}
                >
                  {showPassword ? (
                    <Eye size={20} className="text-primary" />
                  ) : (
                    <EyeOff size={20} />
                  )}
                </motion.div>
              </button>
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <span 
                onClick={() => navigate('/forgot-password')}
                className="cursor-pointer text-xs font-medium text-slate-500 transition-colors hover:text-primary uppercase tracking-widest"
              >
                Reset Access
              </span>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="relative w-full overflow-hidden rounded-2xl bg-primary py-4 font-bold text-black transition-all hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)] disabled:opacity-50"
            >
              <span className="relative z-10">
                {loading ? "Decrypting..." : "Initialize Session"}
              </span>
              
              {/* Shimmer Effect */}
              <motion.div 
                animate={{ x: ['-100%', '200%'] }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
              />
            </motion.button>
          </form>

          {/* Feedback Messages */}
          <AnimatePresence mode="wait">
            {message.text && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`mt-6 flex items-center gap-3 rounded-xl p-4 text-sm font-medium border ${
                  message.type === 'success' 
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                    : 'bg-red-500/10 border-red-500/20 text-red-400'
                }`}
              >
                {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                {message.text}
              </motion.div>
            )}
          </AnimatePresence>
          
          <p className="mt-8 text-center text-xs text-slate-500 uppercase tracking-widest">
            New User?{' '}
            <span 
              onClick={() => navigate('/register')}
              className="cursor-pointer font-bold text-white hover:text-primary transition-colors"
            >
              Generate Identity
            </span>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default Login