import { motion } from 'framer-motion'

function PageHeader({ eyebrow = 'AstraLearn', title, description, action }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between"
    >
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-cyan-200/80">{eyebrow}</p>
        <h1 className="max-w-4xl text-3xl font-black tracking-tight text-white md:text-5xl">{title}</h1>
        {description && <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 md:text-base">{description}</p>}
      </div>
      {action}
    </motion.header>
  )
}

export default PageHeader
