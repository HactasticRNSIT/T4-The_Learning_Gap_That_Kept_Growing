import {
  Users,
  Brain,
  AlertTriangle,
  TrendingUp,
  BookOpen,
  PlusCircle,
  ClipboardList
} from 'lucide-react'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts'

import { useNavigate } from 'react-router-dom'

import { useState, useEffect } from 'react'

import { useAuth } from '../context/AuthContext'

import {
  addStudent,
  getStudents
} from '../services/studentService'

const Dashboard = () => {

  const { currentUser, logout } = useAuth()

  const navigate = useNavigate()

  const [activeSection, setActiveSection] =
    useState('overview')

  const [students, setStudents] =
    useState([])

  const [formData, setFormData] =
    useState({
      name: '',
      grade: '',
      attendance: '',
      mathScore: '',
      physicsScore: '',
      chemistryScore: '',
      remarks: ''
    })

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const performanceData = [
    { month: 'Jan', score: 62 },
    { month: 'Feb', score: 70 },
    { month: 'Mar', score: 76 },
    { month: 'Apr', score: 81 },
    { month: 'May', score: 88 }
  ]

  const subjectData = [
    { subject: 'Math', students: 120 },
    { subject: 'Physics', students: 98 },
    { subject: 'Chemistry', students: 86 },
    { subject: 'Biology', students: 72 }
  ]

  const riskData = [
    { name: 'High Risk', value: 22 },
    { name: 'Medium Risk', value: 38 },
    { name: 'Safe', value: 140 }
  ]

  const COLORS = ['#ef4444', '#f59e0b', '#22c55e']

  const fetchStudents = async () => {
    try {
      const data = await getStudents()
      setStudents(data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await addStudent({
        ...formData,
        attendance: Number(formData.attendance),
        mathScore: Number(formData.mathScore),
        physicsScore: Number(formData.physicsScore),
        chemistryScore: Number(formData.chemistryScore)
      })
      fetchStudents()
      setFormData({
        name: '',
        grade: '',
        attendance: '',
        mathScore: '',
        physicsScore: '',
        chemistryScore: '',
        remarks: ''
      })
      alert('Student Added Successfully')
    } catch (error) {
      console.log(error)
    }
  }

  return (

    <div className='min-h-screen bg-slate-950 text-white'>

      <div className='flex'>

        <aside className='hidden min-h-screen w-72 border-r border-slate-800 bg-slate-900 p-6 lg:block'>

          <h1 className='mb-10 text-3xl font-black text-primary'>
            AstraLearn
          </h1>

          <div className='space-y-4'>

            <div
              onClick={() => setActiveSection('overview')}
              className={`flex cursor-pointer items-center gap-3 rounded-xl p-4 ${
                activeSection === 'overview'
                ? 'bg-primary/20'
                : 'hover:bg-slate-800'
              }`}
            >
              <TrendingUp />
              <span>Overview</span>
            </div>

            <div
              onClick={() => setActiveSection('students')}
              className={`flex cursor-pointer items-center gap-3 rounded-xl p-4 ${
                activeSection === 'students'
                ? 'bg-primary/20'
                : 'hover:bg-slate-800'
              }`}
            >
              <Users />
              <span>Students</span>
            </div>

            <div
              onClick={() => setActiveSection('addStudent')}
              className={`flex cursor-pointer items-center gap-3 rounded-xl p-4 ${
                activeSection === 'addStudent'
                ? 'bg-primary/20'
                : 'hover:bg-slate-800'
              }`}
            >
              <PlusCircle />
              <span>Add Student</span>
            </div>

            <div
              onClick={() => setActiveSection('insights')}
              className={`flex cursor-pointer items-center gap-3 rounded-xl p-4 ${
                activeSection === 'insights'
                ? 'bg-primary/20'
                : 'hover:bg-slate-800'
              }`}
            >
              <Brain />
              <span>AI Insights</span>
            </div>

            <div
              onClick={() => setActiveSection('gaps')}
              className={`flex cursor-pointer items-center gap-3 rounded-xl p-4 ${
                activeSection === 'gaps'
                ? 'bg-primary/20'
                : 'hover:bg-slate-800'
              }`}
            >
              <BookOpen />
              <span>Learning Gaps</span>
            </div>

            <div
              onClick={() => setActiveSection('alerts')}
              className={`flex cursor-pointer items-center gap-3 rounded-xl p-4 ${
                activeSection === 'alerts'
                ? 'bg-primary/20'
                : 'hover:bg-slate-800'
              }`}
            >
              <AlertTriangle />
              <span>Risk Alerts</span>
            </div>

          </div>

        </aside>

        <main className='flex-1 p-6'>

          <div className='mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between'>

            <div>

              <h1 className='text-5xl font-black'>
                Dashboard
              </h1>

              <p className='mt-3 text-slate-400'>
                Welcome back,
                {currentUser?.displayName || ' User'}
              </p>

              <p className='text-slate-500'>
                {currentUser?.email}
              </p>

            </div>

            <button
              onClick={handleLogout}
              className='rounded-xl bg-red-500 px-6 py-3 font-bold'
            >
              Logout
            </button>

          </div>

          {activeSection === 'overview' && (
            <>

              <div className='grid gap-6 md:grid-cols-2 xl:grid-cols-4'>

                <div className='rounded-3xl bg-slate-900 p-6'>
                  <p className='text-slate-400'>Total Students</p>
                  <h2 className='mt-3 text-4xl font-black'>
                    {students.length}
                  </h2>
                </div>

                <div className='rounded-3xl bg-slate-900 p-6'>
                  <p className='text-slate-400'>Prediction Accuracy</p>
                  <h2 className='mt-3 text-4xl font-black'>84%</h2>
                </div>

                <div className='rounded-3xl bg-slate-900 p-6'>
                  <p className='text-slate-400'>High Risk Students</p>
                  <h2 className='mt-3 text-4xl font-black text-red-400'>
                    {students.filter(s => s.riskLevel === 'High').length}
                  </h2>
                </div>

                <div className='rounded-3xl bg-slate-900 p-6'>
                  <p className='text-slate-400'>Attendance Rate</p>
                  <h2 className='mt-3 text-4xl font-black'>92%</h2>
                </div>

              </div>

              <div className='mt-10 grid gap-8 xl:grid-cols-2'>

                <div className='rounded-3xl bg-slate-900 p-6'>
                  <h2 className='mb-6 text-2xl font-bold'>
                    Performance Analytics
                  </h2>
                  <ResponsiveContainer width='100%' height={300}>
                    <LineChart data={performanceData}>
                      <XAxis dataKey='month' />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type='monotone'
                        dataKey='score'
                        stroke='#6C63FF'
                        strokeWidth={4}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className='rounded-3xl bg-slate-900 p-6'>
                  <h2 className='mb-6 text-2xl font-bold'>
                    Subject Engagement
                  </h2>
                  <ResponsiveContainer width='100%' height={300}>
                    <BarChart data={subjectData}>
                      <XAxis dataKey='subject' />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey='students'
                        fill='#6C63FF'
                        radius={[10, 10, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

              </div>

              <div className='mt-10 grid gap-8 xl:grid-cols-2'>

                <div className='rounded-3xl bg-slate-900 p-6'>
                  <h2 className='mb-6 text-2xl font-bold'>
                    AI Risk Distribution
                  </h2>
                  <ResponsiveContainer width='100%' height={300}>
                    <PieChart>
                      <Pie
                        data={riskData}
                        cx='50%'
                        cy='50%'
                        outerRadius={100}
                        dataKey='value'
                        label
                      >
                        {riskData.map((entry, index) => (
                          <Cell
                            key={index}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className='rounded-3xl bg-slate-900 p-6'>
                  <h2 className='mb-6 text-2xl font-bold'>
                    AI Recommendations
                  </h2>
                  <div className='space-y-4'>
                    <div className='rounded-2xl border border-red-500/30 bg-red-500/10 p-4'>
                      Revise Algebra fundamentals for Grade 9 students.
                    </div>
                    <div className='rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-4'>
                      Attendance decline detected in Physics batch.
                    </div>
                    <div className='rounded-2xl border border-green-500/30 bg-green-500/10 p-4'>
                      Biology performance improving consistently.
                    </div>
                  </div>
                </div>

              </div>

            </>
          )}

          {activeSection === 'students' && (
            <div className='rounded-3xl bg-slate-900 p-8'>

              <div className='mb-8 flex items-center justify-between'>
                <h2 className='text-3xl font-black'>Students Management</h2>
                <ClipboardList size={32} />
              </div>

              <div className='overflow-x-auto'>
                <table className='w-full'>
                  <thead>
                    <tr className='border-b border-slate-700 text-left'>
                      <th className='p-4'>Name</th>
                      <th className='p-4'>Grade</th>
                      <th className='p-4'>Attendance</th>
                      <th className='p-4'>Risk</th>
                      <th className='p-4'>Learning Gap</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student.id} className='border-b border-slate-800'>
                        <td className='p-4'>{student.name}</td>
                        <td className='p-4'>{student.grade}</td>
                        <td className='p-4'>{student.attendance}%</td>
                        <td className={`p-4 font-bold ${
                          student.riskLevel === 'High'
                          ? 'text-red-400'
                          : student.riskLevel === 'Moderate'
                          ? 'text-yellow-400'
                          : 'text-green-400'
                        }`}>
                          {student.riskLevel}
                        </td>
                        <td className='p-4 text-slate-300'>
                          {student.learningGap}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {activeSection === 'addStudent' && (
            <div className='rounded-3xl bg-slate-900 p-8'>

              <h2 className='mb-8 text-3xl font-black'>Add Student Data</h2>

              <form
                onSubmit={handleSubmit}
                className='grid gap-6 md:grid-cols-2'
              >

                <input
                  type='text'
                  name='name'
                  value={formData.name}
                  onChange={handleChange}
                  placeholder='Student Name'
                  className='rounded-xl bg-slate-950 p-4 outline-none'
                />

                <input
                  type='text'
                  name='grade'
                  value={formData.grade}
                  onChange={handleChange}
                  placeholder='Grade/Class'
                  className='rounded-xl bg-slate-950 p-4 outline-none'
                />

                <input
                  type='number'
                  name='attendance'
                  value={formData.attendance}
                  onChange={handleChange}
                  placeholder='Attendance %'
                  className='rounded-xl bg-slate-950 p-4 outline-none'
                />

                <input
                  type='number'
                  name='mathScore'
                  value={formData.mathScore}
                  onChange={handleChange}
                  placeholder='Math Score'
                  className='rounded-xl bg-slate-950 p-4 outline-none'
                />

                <input
                  type='number'
                  name='physicsScore'
                  value={formData.physicsScore}
                  onChange={handleChange}
                  placeholder='Physics Score'
                  className='rounded-xl bg-slate-950 p-4 outline-none'
                />

                <input
                  type='number'
                  name='chemistryScore'
                  value={formData.chemistryScore}
                  onChange={handleChange}
                  placeholder='Chemistry Score'
                  className='rounded-xl bg-slate-950 p-4 outline-none'
                />

                <textarea
                  name='remarks'
                  value={formData.remarks}
                  onChange={handleChange}
                  placeholder='Teacher Remarks'
                  className='min-h-[150px] rounded-xl bg-slate-950 p-4 outline-none md:col-span-2'
                />

                <button
                  className='rounded-xl bg-primary py-4 font-bold md:col-span-2'
                >
                  Analyze Student
                </button>

              </form>

            </div>
          )}

          {activeSection === 'insights' && (
            <div className='rounded-3xl bg-slate-900 p-8'>

              <h2 className='mb-6 text-3xl font-black'>AI Insights</h2>

              <div className='space-y-4'>
                {students.map((student) => (
                  <div
                    key={student.id}
                    className='rounded-2xl border border-primary/30 bg-primary/10 p-4'
                  >
                    <p className='text-lg font-bold'>{student.name}</p>
                    <p className='mt-2 text-slate-300'>
                      Risk Level: {student.riskLevel}
                    </p>
                    <p className='text-slate-300'>
                      Learning Gap: {student.learningGap}
                    </p>
                    <p className='text-slate-300'>
                      Recommendation: {student.recommendation}
                    </p>
                  </div>
                ))}
              </div>

            </div>
          )}

          {activeSection === 'gaps' && (
            <div className='rounded-3xl bg-slate-900 p-8'>

              <h2 className='mb-6 text-3xl font-black'>Learning Gaps</h2>

              <div className='space-y-4'>
                {students.map((student) => (
                  <div
                    key={student.id}
                    className='rounded-2xl bg-red-500/10 p-6'
                  >
                    <div className='flex items-center justify-between'>
                      <h3 className='text-2xl font-bold'>{student.name}</h3>
                      <span className={`rounded-full px-4 py-2 text-sm font-bold ${
                        student.riskLevel === 'High'
                        ? 'bg-red-500 text-white'
                        : student.riskLevel === 'Moderate'
                        ? 'bg-yellow-500 text-black'
                        : 'bg-green-500 text-black'
                      }`}>
                        {student.riskLevel}
                      </span>
                    </div>
                    <p className='mt-4 text-lg text-slate-300'>
                      Learning Gap: {student.learningGap}
                    </p>
                    <p className='mt-2 text-slate-400'>
                      Recommendation: {student.recommendation}
                    </p>
                  </div>
                ))}
              </div>

            </div>
          )}

          {activeSection === 'alerts' && (
            <div className='rounded-3xl bg-slate-900 p-8'>

              <h2 className='mb-6 text-3xl font-black'>Risk Alerts</h2>

              <div className='space-y-4'>
                {students
                  .filter(student => student.riskLevel === 'High')
                  .map((student) => (
                    <div
                      key={student.id}
                      className='rounded-2xl border border-red-500 bg-red-500/10 p-6'
                    >
                      <h3 className='text-2xl font-bold text-red-400'>
                        {student.name}
                      </h3>
                      <p className='mt-3 text-slate-300'>
                        Immediate intervention required.
                      </p>
                      <p className='mt-2 text-slate-400'>
                        Gap: {student.learningGap}
                      </p>
                    </div>
                  ))}
              </div>

            </div>
          )}

        </main>

      </div>

    </div>

  )

}

export default Dashboard