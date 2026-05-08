import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Orbit, Sparkles } from 'lucide-react'

const rings = Array.from({ length: 5 }, (_, index) => index)

function Intro() {
  return (
    <main className="relative grid min-h-screen overflow-hidden bg-ink text-white">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(103,232,249,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(103,232,249,0.08)_1px,transparent_1px)] bg-[size:56px_56px]" />
      <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-cyan-300/15 to-transparent" />

      <section className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-[1fr_0.85fr]">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-200/20 bg-cyan-200/10 px-4 py-2 text-sm text-cyan-100">
            <Sparkles size={16} />
            Predictive academic intelligence platform
          </div>
          <h1 className="max-w-4xl text-5xl font-black leading-tight tracking-tight md:text-7xl">
            Identify academic risk before failure becomes visible.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            AstraLearn blends teacher signals, performance data, attendance patterns, and Sarvam AI analysis into a live
            intervention cockpit for educators.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link to="/home" className="primary-button">
              Launch Interface
              <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="secondary-button">
              Teacher Login
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.8 }}
          className="relative mx-auto aspect-square w-full max-w-[520px]"
        >
          {rings.map((ring) => (
            <motion.div
              key={ring}
              animate={{ rotate: ring % 2 ? -360 : 360 }}
              transition={{ duration: 22 + ring * 5, repeat: Infinity, ease: 'linear' }}
              className="absolute rounded-full border border-cyan-200/20"
              style={{
                inset: `${ring * 9}%`,
                boxShadow: ring === 0 ? '0 0 90px rgba(103, 232, 249, 0.22)' : undefined,
              }}
            >
              <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-cyan-200 shadow-glow" />
            </motion.div>
          ))}
          <div className="absolute inset-[24%] grid place-items-center rounded-full border border-white/15 bg-white/[0.06] backdrop-blur-xl">
            <div className="text-center">
              <Orbit className="mx-auto mb-4 text-cyan-200" size={58} />
              <p className="text-4xl font-black">84%</p>
              <p className="text-sm text-slate-400">intervention confidence</p>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  )
}

export default Intro