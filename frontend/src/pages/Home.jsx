import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AlertTriangle, ArrowRight, BrainCircuit, LineChart, ShieldCheck, Target } from 'lucide-react'

const features = [
  {
    title: 'Risk Prediction',
    description: 'Surface high, moderate, and safe learner cohorts from attendance, scores, and classroom remarks.',
    icon: LineChart,
  },
  {
    title: 'Learning Gap Detection',
    description: 'Translate raw marks into weak concepts teachers can act on immediately.',
    icon: Target,
  },
  {
    title: 'AI Intervention Plans',
    description: 'Generate practical recommendations with Sarvam AI and store every analysis in Firestore.',
    icon: BrainCircuit,
  },
]

function Home() {
  return (
    <div className="overflow-hidden">
      <section className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-28">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-cyan-200">Academic early warning OS</p>
          <h1 className="max-w-4xl text-5xl font-black leading-tight tracking-tight text-white md:text-7xl">
            Turn classroom data into rescue missions.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            AstraLearn gives teachers a command center for predicting risk, diagnosing learning gaps, and launching
            personalized interventions before grades collapse.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link to="/register" className="primary-button">
              Register
              <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="secondary-button">
              Login
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-panel rounded-lg p-5"
        >
          <div className="grid gap-4">
            <div className="rounded-lg border border-rose-300/20 bg-rose-400/10 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-rose-100">High risk signal</p>
                  <p className="mt-2 text-3xl font-black">12 students</p>
                </div>
                <AlertTriangle className="text-rose-200" size={38} />
              </div>
              <div className="mt-5 h-2 rounded-full bg-white/10">
                <div className="h-full w-[68%] rounded-full bg-rose-300" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="glass-card">
                <ShieldCheck className="mb-4 text-emerald-200" />
                <p className="text-3xl font-black">64%</p>
                <p className="mt-1 text-sm text-slate-400">safe cohort</p>
              </div>
              <div className="glass-card">
                <BrainCircuit className="mb-4 text-cyan-200" />
                <p className="text-3xl font-black">AI</p>
                <p className="mt-1 text-sm text-slate-400">recommendation engine</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.03]">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
          {features.map((feature, index) => {
            const Icon = feature.icon

            return (
              <motion.article
                key={feature.title}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="glass-card"
              >
                <Icon className="mb-5 text-cyan-200" size={34} />
                <h2 className="text-xl font-bold text-white">{feature.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-400">{feature.description}</p>
              </motion.article>
            )
          })}
        </div>
      </section>
    </div>
  )
}

export default Home
