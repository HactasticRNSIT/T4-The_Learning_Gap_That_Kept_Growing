export function normalizeRisk(riskLevel = '') {
  const lower = riskLevel.toLowerCase()
  if (lower.includes('high')) return 'High'
  if (lower.includes('moderate') || lower.includes('medium')) return 'Moderate'
  return 'Safe'
}
