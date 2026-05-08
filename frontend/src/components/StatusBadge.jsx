import { normalizeRisk } from '../utils/risk'

const styles = {
  High: 'bg-rose-400/15 text-rose-200 ring-1 ring-rose-300/25',
  Moderate: 'bg-amber-300/15 text-amber-100 ring-1 ring-amber-300/25',
  Safe: 'bg-emerald-300/15 text-emerald-100 ring-1 ring-emerald-300/25',
}

function StatusBadge({ riskLevel }) {
  const normalized = normalizeRisk(riskLevel)

  return <span className={`status-pill ${styles[normalized]}`}>{normalized}</span>
}

export default StatusBadge
