import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AlertTriangle, CheckCircle2, PlusCircle, Users } from 'lucide-react'
import {
  Bar,
  BarChart,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import EmptyState from '../components/EmptyState'
import PageHeader from '../components/PageHeader'
import { useStudents } from '../hooks/useStudents'
import { normalizeRisk } from '../utils/risk'

const riskColors = {
  High: '#fb7185',
  Moderate: '#fbbf24',
  Safe: '#34d399',
}

function average(values) {
  if (!values.length) return 0
  return Math.round(values.reduce((sum, value) => sum + Number(value || 0), 0) / values.length)
}

function DashboardOverview() {
  const { students, loading, error } = useStudents()
  const highRisk = students.filter((student) => normalizeRisk(student.riskLevel) === 'High')
  const moderateRisk = students.filter((student) => normalizeRisk(student.riskLevel) === 'Moderate')
  const safeStudents = students.filter((student) => normalizeRisk(student.riskLevel) === 'Safe')

  const stats = [
    { label: 'Total Students', value: students.length, icon: Users, tone: 'text-cyan-200' },
    { label: 'High Risk Students', value: highRisk.length, icon: AlertTriangle, tone: 'text-rose-200' },
    { label: 'Moderate Risk Students', value: moderateRisk.length, icon: AlertTriangle, tone: 'text-amber-200' },
    { label: 'Safe Students', value: safeStudents.length, icon: CheckCircle2, tone: 'text-emerald-200' },
  ]

  const performanceData = students
    .slice()
    .reverse()
    .map((student, index) => ({
      label: student.name?.split(' ')[0] || `S${index + 1}`,
      score: average([student.mathScore, student.physicsScore, student.chemistryScore]),
    }))
    .slice(-8)

  const subjectData = [
    { subject: 'Math', average: average(students.map((student) => student.mathScore)) },
    { subject: 'Physics', average: average(students.map((student) => student.physicsScore)) },
    { subject: 'Chemistry', average: average(students.map((student) => student.chemistryScore)) },
  ]

  const riskData = [
    { name: 'High', value: highRisk.length },
    { name: 'Moderate', value: moderateRisk.length },
    { name: 'Safe', value: safeStudents.length },
  ].filter((item) => item.value > 0)

  return (
    <>
      <PageHeader
        title="Academic Risk Command Center"
        description="Live Firestore data, AI risk distribution, score trends, and subject analytics for your current student cohort."
        action={
          <Link to="/dashboard/add-student" className="primary-button">
            <PlusCircle size={18} />
            Add Student
          </Link>
        }
      />

      {error && <div className="mb-6 rounded-lg border border-rose-300/20 bg-rose-400/10 p-4 text-rose-100">{error}</div>}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-card"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-400">{stat.label}</p>
                <Icon className={stat.tone} size={22} />
              </div>
              <p className="mt-4 text-4xl font-black">{loading ? '-' : stat.value}</p>
            </motion.div>
          )
        })}
      </div>

      {students.length === 0 && !loading ? (
        <div className="mt-6">
          <EmptyState />
        </div>
      ) : (
        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          <section className="glass-card">
            <h2 className="mb-5 text-xl font-bold">Performance Trends</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <XAxis dataKey="label" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" domain={[0, 100]} />
                  <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)' }} />
                  <Line type="monotone" dataKey="score" stroke="#67e8f9" strokeWidth={3} dot={{ fill: '#67e8f9' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="glass-card">
            <h2 className="mb-5 text-xl font-bold">Subject Analytics</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectData}>
                  <XAxis dataKey="subject" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" domain={[0, 100]} />
                  <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)' }} />
                  <Bar dataKey="average" fill="#34d399" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="glass-card xl:col-span-2">
            <h2 className="mb-5 text-xl font-bold">Risk Distribution</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={riskData} dataKey="value" nameKey="name" innerRadius={72} outerRadius={118} label>
                    {riskData.map((entry) => (
                      <Cell key={entry.name} fill={riskColors[entry.name]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>
      )}
    </>
  )
}

export default DashboardOverview
