import React, { useState } from 'react'
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth'
import { auth } from '../firebase/firebase' // Double check this path matches your project
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Mail, Lock, Phone, UserPlus, CheckCircle2, AlertCircle, Eye, EyeOff, ArrowRight } from 'lucide-react'

const Register = () => {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })
  const [userCreated, setUserCreated] = useState(false)

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ text: '', type: '' })

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(userCredential.user, { displayName: name })
      await sendEmailVerification(userCredential.user)
      setUserCreated(true)
      setMessage({ text: 'Verification link dispatched to your inbox.', type: 'success' })
    } catch (error) {
      setMessage({ text: error.message, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleVerified = async () => {
    setLoading(true)
    try {
      await auth.currentUser.reload()
      if (auth.currentUser.emailVerified) {
        navigate('/dashboard')
      } else {
        setMessage({ text: 'Access denied. Email remains unverified.', type: 'error' })
      }
    } catch (error) {
      setMessage({ text: 'Session expired. Please log in again.', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#020617] px-6 py-12 text-white selection:bg-primary/30">
      <div className="absolute h-[600px] w-[600px] rounded-full bg-emerald-500/5 blur-[130px] animate-pulse" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="rounded-[2.5rem] border border-white/10 bg-white/5 p-8 backdrop-blur-2xl shadow-2xl md:p-10">
          <AnimatePresence mode="wait">
            {!userCreated ? (
              <motion.div
                key="register-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className="mb-8">
                  <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20">
                    <UserPlus size={28} />
                  </div>
                  <h1 className="text-3xl font-black tracking-tight">Create Identity</h1>
                  <p className="text-slate-400">Join the neural network</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                      type="text"
                      required
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-2xl border border-white/5 bg-slate-950/50 py-4 pl-12 pr-4 outline-none transition-all focus:border-primary/50 focus:ring-1 focus:ring-primary/50"
                    />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-2xl border border-white/5 bg-slate-950/50 py-4 pl-12 pr-4 outline-none transition-all focus:border-primary/50 focus:ring-1 focus:ring-primary/50"
                    />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                      type="email"
                      required
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-2xl border border-white/5 bg-slate-950/50 py-4 pl-12 pr-4 outline-none transition-all focus:border-primary/50 focus:ring-1 focus:ring-primary/50"
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Create Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-2xl border border-white/5 bg-slate-950/50 py-4 pl-12 pr-12 outline-none transition-all focus:border-primary/50 focus:ring-1 focus:ring-primary/50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                    >
                      {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    disabled={loading}
                    className="w-full rounded-2xl bg-primary py-4 font-bold text-black shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 disabled:opacity-50"
                  >
                    {loading ? "Constructing Account..." : "Confirm Registration"}
                  </motion.button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="verify-prompt"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 ring-2 ring-emerald-500/40">
                  <Mail size={40} className="animate-bounce" />
                </div>
                <h2 className="mb-2 text-2xl font-bold">Check your Inbox</h2>
                <p className="mb-8 text-slate-400">We've sent a verification link to <br/><span className="text-white font-medium">{email}</span></p>
                <motion.button
                  whileHover={{ x: 5 }}
                  disabled={loading}
                  onClick={handleVerified}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-primary py-4 font-bold text-primary transition-all hover:bg-primary hover:text-black disabled:opacity-50"
                >
                  {loading ? "Checking Status..." : "I've Verified My Email"} <ArrowRight size={20} />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {message.text && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-6 flex items-center gap-3 rounded-xl p-4 text-sm border ${
                message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
              }`}
            >
              {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              {message.text}
            </motion.div>
          )}

          <p className="mt-8 text-center text-sm text-slate-500">
            Already registered?{' '}
            <span 
              onClick={() => navigate('/login')}
              className="cursor-pointer font-bold text-white hover:text-primary transition-colors"
            >
              Access Terminal
            </span>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default Register