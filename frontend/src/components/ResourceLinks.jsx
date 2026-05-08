import { ExternalLink } from 'lucide-react'

function ResourceLinks({ resources = [] }) {
  const visibleResources = Array.isArray(resources) ? resources.filter((resource) => resource?.url).slice(0, 4) : []

  if (!visibleResources.length) {
    return null
  }

  return (
    <div>
      <p className="text-sm font-semibold text-amber-100">Resources to Refer</p>
      <div className="mt-3 grid gap-3">
        {visibleResources.map((resource) => (
          <a
            key={resource.url}
            href={resource.url}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-white/10 bg-white/[0.04] p-3 transition hover:border-amber-200/40 hover:bg-amber-200/10"
          >
            <span className="flex items-start justify-between gap-3">
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-white">{resource.title || 'Learning resource'}</span>
                {resource.content && <span className="mt-1 block text-xs leading-5 text-slate-400">{resource.content}</span>}
              </span>
              <ExternalLink className="mt-0.5 shrink-0 text-amber-100" size={16} />
            </span>
          </a>
        ))}
      </div>
    </div>
  )
}

export default ResourceLinks
