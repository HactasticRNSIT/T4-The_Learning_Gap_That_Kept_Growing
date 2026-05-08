import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { Link } from 'react-router-dom';
import { KeyRound, ArrowLeft, Mail, CheckCircle2, AlertCircle } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: '', msg: '' }); // 'success' | 'error'
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: '', msg: '' });

    try {
      await sendPasswordResetEmail(auth, email);
      setStatus({ 
        type: 'success', 
        msg: 'Recovery protocol initiated. Check your inbox.' 
      });
    } catch (error) {
      setStatus({ 
        type: 'error', 
        msg: error.code === 'auth/user-not-found' 
          ? 'No account associated with this address.' 
          : 'System error. Please try again later.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#020617] px-6 text-white selection:bg-primary/30">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Brand Header */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-primary shadow-xl shadow-primary/10">
            <KeyRound size={32} />
          </div>
          <h1 className="text-4xl font-black tracking-tighter">RESET ACCESS</h1>
          <p className="mt-2 text-slate-400">Enter your credentials to verify identity</p>
        </div>

        <div className="rounded-[2.5rem] border border-white/5 bg-slate-900/50 p-8 backdrop-blur-3xl shadow-2xl">
          <form onSubmit={handleReset} className="space-y-6">
            <div className="group relative">
              <label className="mb-2 ml-1 block text-xs font-bold uppercase tracking-widest text-slate-500 group-focus-within:text-primary transition-colors">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                <input
                  type="email"
                  required
                  placeholder="name@nexus.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-white/5 bg-slate-950 p-4 pl-12 outline-none ring-primary/20 transition-all focus:border-primary/50 focus:ring-4"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
              className="relative w-full overflow-hidden rounded-2xl bg-primary py-4 font-black text-black shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                  PROCESSING...
                </div>
              ) : (
                "SEND RESET LINK"
              )}
            </motion.button>
          </form>

          <AnimatePresence>
            {status.msg && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`mt-6 flex items-center gap-3 rounded-xl border p-4 ${
                  status.type === 'success' 
                    ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400' 
                    : 'border-red-500/20 bg-red-500/10 text-red-400'
                }`}
              >
                {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                <p className="text-sm font-medium">{status.msg}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-8 text-center"
        >
          <Link 
            to="/login" 
            className="group inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition-colors hover:text-white"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            Back to Secure Login
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;