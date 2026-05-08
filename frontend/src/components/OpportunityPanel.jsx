import { useState } from 'react'
import { Award, ExternalLink, LocateFixed, MapPin, Trophy } from 'lucide-react'
import { updateStudentLocation } from '../services/studentService'
import { buildStudentProfile } from '../utils/academicIntelligence'

function fallbackOpportunities(student) {
  const profile = buildStudentProfile(student)

  return [
    {
      type: 'Scholarship',
      title: 'National Scholarship Portal',
      url: 'https://scholarships.gov.in/',
      content: `Check merit and support schemes. ${profile.average >= 75 ? 'Strong marks can support merit-based applications.' : 'Use this after improving core scores and attendance.'}`,
    },
    {
      type: 'Event',
      title: `${profile.weakest.label} Olympiad or Science Fair`,
      url: 'https://olympiads.hbcse.tifr.res.in/',
      content: `Recommended after weekly practice in ${profile.weakest.concepts[1]}.`,
    },
  ]
}

function OpportunityPanel({ student, compact = false, onLocationSaved }) {
  const [savingLocation, setSavingLocation] = useState(false)
  const [locationMessage, setLocationMessage] = useState('')
  const [locationError, setLocationError] = useState('')

  if (!student) return null

  const profile = buildStudentProfile(student)
  const opportunities = Array.isArray(student.opportunities) && student.opportunities.length ? student.opportunities : fallbackOpportunities(student)
  const visibleItems = compact ? opportunities.slice(0, 3) : opportunities.slice(0, 5)
  const locationLabel = student.location?.label || student.location?.city
  const hasLocation = Boolean(student.location?.latitude && student.location?.longitude)

  const handleUseLocation = () => {
    setLocationMessage('')
    setLocationError('')

    if (!navigator.geolocation) {
      setLocationError('Location access is not supported in this browser.')
      return
    }

    setSavingLocation(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const result = await updateStudentLocation(student.id, {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            label: 'Current location',
          })
          setLocationMessage('Location saved. Opportunities were refreshed for your area.')
          onLocationSaved?.(result.student)
        } catch (err) {
          setLocationError(err.message)
        } finally {
          setSavingLocation(false)
        }
      },
      (error) => {
        setLocationError(error.message || 'Location permission was not granted.')
        setSavingLocation(false)
      },
      { enableHighAccuracy: false, maximumAge: 300000, timeout: 12000 },
    )
  }

  return (
    <section className={compact ? 'rounded-lg border border-white/10 bg-black/20 p-4' : 'glass-card'}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-emerald-100">
            <Award size={20} />
            <p className="text-sm font-semibold">Scholarships and Participation</p>
          </div>
          <h2 className="mt-3 text-xl font-bold text-white">Recommended for {profile.name}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Based on {profile.weakest.label} priority, {profile.average}% average, {profile.attendance}% attendance, current risk, and saved location.
          </p>
        </div>
        <button type="button" className="secondary-button shrink-0 px-4 py-2" onClick={handleUseLocation} disabled={savingLocation}>
          <LocateFixed size={17} />
          {savingLocation ? 'Finding...' : hasLocation ? 'Refresh Location' : 'Use Location'}
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-300">
        <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 font-semibold ${hasLocation ? 'bg-emerald-300/15 text-emerald-100' : 'bg-white/10 text-slate-300'}`}>
          <MapPin size={13} />
          {hasLocation ? locationLabel || 'Location saved' : 'Location not shared'}
        </span>
        {locationMessage && <span className="text-emerald-100">{locationMessage}</span>}
        {locationError && <span className="text-rose-100">{locationError}</span>}
      </div>

      <div className="mt-5 grid gap-3">
        {visibleItems.map((item) => (
          <a
            key={`${item.type}-${item.url}-${item.title}`}
            href={item.url || '#'}
            target={item.url ? '_blank' : undefined}
            rel={item.url ? 'noreferrer' : undefined}
            className="rounded-lg border border-white/10 bg-white/[0.04] p-4 transition hover:border-emerald-200/40 hover:bg-emerald-200/10"
          >
            <span className="flex items-start justify-between gap-3">
              <span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-emerald-100">
                  <Trophy size={13} />
                  {item.type || 'Opportunity'}
                </span>
                {item.locationMatched && (
                  <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-emerald-300/15 px-3 py-1 text-xs font-semibold text-emerald-100">
                    <MapPin size={13} />
                    Local match
                  </span>
                )}
                <span className="mt-3 block text-sm font-bold text-white">{item.title}</span>
                {item.content && <span className="mt-2 block text-sm leading-6 text-slate-300">{item.content}</span>}
              </span>
              {item.url && <ExternalLink className="mt-1 shrink-0 text-emerald-100" size={16} />}
            </span>
          </a>
        ))}
      </div>
    </section>
  )
}

export default OpportunityPanel
