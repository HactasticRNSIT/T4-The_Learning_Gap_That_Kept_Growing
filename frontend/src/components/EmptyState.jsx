import { Database } from 'lucide-react'

function EmptyState({ title = 'No records yet', description = 'Add your first student to activate the intelligence layer.' }) {
  return (
    <div className="grid min-h-64 place-items-center rounded-lg border border-dashed border-white/15 bg-white/[0.03] p-8 text-center">
      <div>
        <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-lg bg-cyan-300/10 text-cyan-200">
          <Database size={22} />
        </div>
        <h2 className="text-xl font-bold text-white">{title}</h2>
        <p className="mt-2 max-w-md text-sm text-slate-400">{description}</p>
      </div>
    </div>
  )
}

export default EmptyState
