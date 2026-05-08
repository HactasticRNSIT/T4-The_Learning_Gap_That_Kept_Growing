import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { addStudent } from '../services/studentService'

const initialForm = {
  name: '',
  grade: '',
  attendance: '',
  mathScore: '',
  physicsScore: '',
  chemistryScore: '',
  remarks: '',
}

function AddStudent() {
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const updateField = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      await addStudent({
        ...form,
        attendance: Number(form.attendance),
        mathScore: Number(form.mathScore),
        physicsScore: Number(form.physicsScore),
        chemistryScore: Number(form.chemistryScore),
      })
      setForm(initialForm)
      navigate('/dashboard/students')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <PageHeader
        title="Add Student"
        description="Submit raw academic signals. The backend calls Sarvam AI, normalizes the JSON response, then writes the complete record to Firestore."
      />

      <motion.form
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="glass-panel grid gap-5 rounded-lg p-5 md:grid-cols-2 md:p-7"
      >
        <label>
          <span className="mb-2 block text-sm font-semibold text-slate-200">Name</span>
          <input className="field" name="name" required value={form.name} onChange={updateField} placeholder="Student name" />
        </label>

        <label>
          <span className="mb-2 block text-sm font-semibold text-slate-200">Grade</span>
          <input className="field" name="grade" required value={form.grade} onChange={updateField} placeholder="Grade 10" />
        </label>

        <label>
          <span className="mb-2 block text-sm font-semibold text-slate-200">Attendance %</span>
          <input className="field" name="attendance" required min="0" max="100" type="number" value={form.attendance} onChange={updateField} />
        </label>

        <label>
          <span className="mb-2 block text-sm font-semibold text-slate-200">Math Score</span>
          <input className="field" name="mathScore" required min="0" max="100" type="number" value={form.mathScore} onChange={updateField} />
        </label>

        <label>
          <span className="mb-2 block text-sm font-semibold text-slate-200">Physics Score</span>
          <input className="field" name="physicsScore" required min="0" max="100" type="number" value={form.physicsScore} onChange={updateField} />
        </label>

        <label>
          <span className="mb-2 block text-sm font-semibold text-slate-200">Chemistry Score</span>
          <input className="field" name="chemistryScore" required min="0" max="100" type="number" value={form.chemistryScore} onChange={updateField} />
        </label>

        <label className="md:col-span-2">
          <span className="mb-2 block text-sm font-semibold text-slate-200">Teacher Remarks</span>
          <textarea
            className="field min-h-36 resize-y"
            name="remarks"
            required
            value={form.remarks}
            onChange={updateField}
            placeholder="Notes about participation, homework, confidence, recent changes, or classroom behavior"
          />
        </label>

        {error && (
          <div className="rounded-lg border border-rose-300/20 bg-rose-400/10 p-4 text-sm text-rose-100 md:col-span-2">
            {error}
          </div>
        )}

        <button className="primary-button md:col-span-2" disabled={loading}>
          <Sparkles size={18} />
          {loading ? 'Analyzing with Sarvam AI...' : 'Analyze and Save Student'}
        </button>
      </motion.form>
    </>
  )
}

export default AddStudent
