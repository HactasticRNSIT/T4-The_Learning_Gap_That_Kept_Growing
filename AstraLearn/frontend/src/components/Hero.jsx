// src/components/Hero.jsx

import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const Hero = () => {

  const navigate = useNavigate()

  return (
    <section className='relative overflow-hidden px-6 py-28'>
      <div className='mx-auto max-w-7xl text-center'>
        
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className='text-5xl font-black leading-tight md:text-7xl'
        >
          AI Powered
          <span className='block text-primary'>
            Learning Gap Detection
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className='mx-auto mt-8 max-w-3xl text-lg text-slate-300'
        >
          Track student learning patterns, predict academic decline,
          identify hidden performance gaps, and provide personalized
          interventions using AI-driven educational analytics.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className='mt-10 flex justify-center gap-4'
        >

          <button
            onClick={() => navigate('/login')}
            className='rounded-xl bg-primary px-8 py-4 font-semibold transition hover:scale-105'
          >
            Get Started
          </button>

          <button
            onClick={() => navigate('/register')}
            className='rounded-xl border border-slate-700 px-8 py-4 font-semibold transition hover:border-primary'
          >
            Sign Up
          </button>

        </motion.div>
      </div>
    </section>
  )
}

export default Hero