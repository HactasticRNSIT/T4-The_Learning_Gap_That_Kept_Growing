import { useState } from 'react'
import { FolderUp, Link as LinkIcon, Star } from 'lucide-react'
import { submitStudentProject } from '../services/studentService'

const initialForm = {
  title: '',
  subject: '',
  projectUrl: '',
  description: '',
}

function ProjectUploadPanel({ student, onProjectSaved, compact = false }) {
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  if (!student) return null

  const projects = Array.isArray(student.projects) ? student.projects : []
  const starPoints = Number(student.starPoints || 0)

  const updateField = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')

    try {
      const result = await submitStudentProject(student.id, form)
      setForm(initialForm)
      setMessage(`Project submitted. +${result.project.pointsAwarded} star points added.`)
      onProjectSaved?.(result.student)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className={compact ? 'rounded-lg border border-white/10 bg-black/20 p-4' : 'glass-card'}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-amber-100">
            <FolderUp size={20} />
            <p className="text-sm font-semibold">Project Portfolio</p>
          </div>
          <h2 className="mt-3 text-xl font-bold text-white">Upload Projects</h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Each project adds star points. Strong descriptions and working links earn more points.
          </p>
        </div>
        <div className="rounded-lg border border-amber-200/20 bg-amber-200/10 px-4 py-3">
          <p className="text-xs font-semibold text-amber-100">Star Points</p>
          <p className="mt-1 text-3xl font-black text-white">{starPoints}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 grid gap-4 md:grid-cols-2">
        <input className="field" name="title" value={form.title} onChange={updateField} required placeholder="Project title" />
        <select className="field" name="subject" value={form.subject} onChange={updateField}>
          <option value="">General project</option>
          <option value="Math">Math</option>
          <option value="Physics">Physics</option>
          <option value="Chemistry">Chemistry</option>
          <option value="Innovation">Innovation</option>
        </select>
        <label className="relative md:col-span-2">
          <LinkIcon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            className="field pl-11"
            name="projectUrl"
            value={form.projectUrl}
            onChange={updateField}
            placeholder="Project link, demo, GitHub, Drive, or presentation URL"
          />
        </label>
        <textarea
          className="field min-h-28 resize-y md:col-span-2"
          name="description"
          value={form.description}
          onChange={updateField}
          required
          placeholder="What did you build, what problem did it solve, and what did you learn?"
        />

        {message && <div className="rounded-lg border border-emerald-300/20 bg-emerald-300/10 p-3 text-sm text-emerald-100 md:col-span-2">{message}</div>}
        {error && <div className="rounded-lg border border-rose-300/20 bg-rose-400/10 p-3 text-sm text-rose-100 md:col-span-2">{error}</div>}

        <button type="submit" className="primary-button md:col-span-2" disabled={loading}>
          <Star size={18} />
          {loading ? 'Adding star points...' : 'Submit Project'}
        </button>
      </form>

      {!compact && projects.length > 0 && (
        <div className="mt-6 grid gap-3">
          {projects.slice().reverse().map((project) => (
            <article key={project.id} className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-white">{project.title}</p>
                  <p className="mt-1 text-sm text-slate-400">{project.subject || 'General'} - +{project.pointsAwarded} points</p>
                </div>
                {project.projectUrl && (
                  <a href={project.projectUrl} target="_blank" rel="noreferrer" className="text-sm font-semibold text-cyan-100 hover:text-cyan-50">
                    Open
                  </a>
                )}
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-300">{project.description}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default ProjectUploadPanel
