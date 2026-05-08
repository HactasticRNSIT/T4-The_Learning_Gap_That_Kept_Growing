import axios from 'axios'

const TAVILY_URL = 'https://api.tavily.com/search'

const curatedResources = {
  math: [
    {
      title: 'Khan Academy Math',
      url: 'https://www.khanacademy.org/math',
      content: 'Topic lessons, examples, and practice exercises for math fundamentals.',
    },
    {
      title: 'CK-12 Math Practice',
      url: 'https://www.ck12.org/student/',
      content: 'Free adaptive lessons and practice across school math topics.',
    },
  ],
  physics: [
    {
      title: 'Khan Academy Physics',
      url: 'https://www.khanacademy.org/science/physics',
      content: 'Concept videos and practice for mechanics, electricity, waves, and more.',
    },
    {
      title: 'PhET Physics Simulations',
      url: 'https://phet.colorado.edu/en/simulations/filter?subjects=physics&type=html',
      content: 'Interactive simulations that help students visualize physics concepts.',
    },
  ],
  chemistry: [
    {
      title: 'Khan Academy Chemistry',
      url: 'https://www.khanacademy.org/science/chemistry',
      content: 'Structured chemistry lessons with examples and review questions.',
    },
    {
      title: 'ChemCollective Virtual Labs',
      url: 'https://chemcollective.org/vlabs',
      content: 'Virtual chemistry labs and scenario-based activities for practice.',
    },
  ],
  general: [
    {
      title: 'Khan Academy',
      url: 'https://www.khanacademy.org/',
      content: 'Free lessons and practice resources across core school subjects.',
    },
    {
      title: 'CK-12 Student Resources',
      url: 'https://www.ck12.org/student/',
      content: 'Free textbooks, adaptive practice, and concept explanations.',
    },
  ],
}

const curatedOpportunities = {
  math: [
    {
      type: 'Scholarship',
      title: 'National Scholarship Portal',
      url: 'https://scholarships.gov.in/',
      content: 'Government scholarship portal where students can check eligibility and active schemes.',
    },
    {
      type: 'Event',
      title: 'Mathematics Olympiad Preparation',
      url: 'https://olympiads.hbcse.tifr.res.in/',
      content: 'Reference portal for olympiad pathways and participation updates in mathematics and science.',
    },
  ],
  physics: [
    {
      type: 'Scholarship',
      title: 'National Scholarship Portal',
      url: 'https://scholarships.gov.in/',
      content: 'Government scholarship portal where students can check eligibility and active schemes.',
    },
    {
      type: 'Event',
      title: 'Science Olympiad Pathways',
      url: 'https://olympiads.hbcse.tifr.res.in/',
      content: 'Science olympiad reference portal for motivated students in physics and science.',
    },
  ],
  chemistry: [
    {
      type: 'Scholarship',
      title: 'National Scholarship Portal',
      url: 'https://scholarships.gov.in/',
      content: 'Government scholarship portal where students can check eligibility and active schemes.',
    },
    {
      type: 'Event',
      title: 'Chemistry and Science Olympiad Pathways',
      url: 'https://olympiads.hbcse.tifr.res.in/',
      content: 'Reference portal for science olympiad participation and preparation information.',
    },
  ],
  general: [
    {
      type: 'Scholarship',
      title: 'National Scholarship Portal',
      url: 'https://scholarships.gov.in/',
      content: 'Government scholarship portal where students can check eligibility and active schemes.',
    },
    {
      type: 'Event',
      title: 'ATL Tinkering and Innovation Programs',
      url: 'https://aim.gov.in/',
      content: 'Innovation and student participation programs for projects, tinkering, and problem solving.',
    },
  ],
}

const curatedCompanyRecommendations = {
  math: [
    {
      company: 'Google',
      roleTrack: 'Data analytics, software engineering, AI foundations',
      applyUrl: 'https://careers.google.com/students/',
      details: 'Student career page with internships, early career roles, and preparation paths.',
      fitReason: 'Strong math growth supports coding, algorithms, and data problem solving.',
      readinessAction: 'Build two projects using data, charts, or simple machine learning.',
    },
    {
      company: 'Microsoft',
      roleTrack: 'Software engineering, cloud, product building',
      applyUrl: 'https://careers.microsoft.com/students/',
      details: 'Student and early career opportunities for software, cloud, and product roles.',
      fitReason: 'Math and structured problem solving match engineering pathways.',
      readinessAction: 'Create a portfolio with one web app and one problem-solving project.',
    },
  ],
  physics: [
    {
      company: 'Tesla',
      roleTrack: 'Robotics, mobility, energy systems',
      applyUrl: 'https://www.tesla.com/careers',
      details: 'Career portal for engineering, manufacturing, energy, and robotics-related teams.',
      fitReason: 'Physics strength connects to motion, systems, circuits, and engineering thinking.',
      readinessAction: 'Build a simulation, electronics, or robotics project with clear documentation.',
    },
    {
      company: 'Siemens',
      roleTrack: 'Engineering, automation, industrial technology',
      applyUrl: 'https://www.siemens.com/global/en/company/jobs.html',
      details: 'Career portal for engineering, automation, digital industry, and infrastructure roles.',
      fitReason: 'Physics and numerical reasoning support industrial engineering pathways.',
      readinessAction: 'Create a project around sensors, automation, or energy efficiency.',
    },
  ],
  chemistry: [
    {
      company: 'Biocon',
      roleTrack: 'Biotech, lab research, healthcare innovation',
      applyUrl: 'https://www.biocon.com/careers/',
      details: 'Career portal for biotechnology, research, manufacturing, and healthcare roles.',
      fitReason: 'Chemistry interest can grow into biotech, pharmacy, and lab science pathways.',
      readinessAction: 'Prepare a science fair project with hypothesis, method, result, and reflection.',
    },
    {
      company: 'Dr. Reddy\'s Laboratories',
      roleTrack: 'Pharmaceutical science, quality, research',
      applyUrl: 'https://careers.drreddys.com/',
      details: 'Career portal for pharmaceutical research, operations, and quality-related roles.',
      fitReason: 'Chemistry fundamentals align with pharma and applied science careers.',
      readinessAction: 'Build a documented chemistry model, experiment log, or research poster.',
    },
  ],
  general: [
    {
      company: 'TCS',
      roleTrack: 'IT services, software, business technology',
      applyUrl: 'https://www.tcs.com/careers',
      details: 'Career portal for technology, consulting, and early-career opportunities.',
      fitReason: 'Balanced academic improvement and projects can support entry into IT pathways.',
      readinessAction: 'Upload projects showing communication, coding basics, and problem solving.',
    },
    {
      company: 'Infosys',
      roleTrack: 'Software, digital services, consulting',
      applyUrl: 'https://www.infosys.com/careers/',
      details: 'Career portal for technology roles, student programs, and early-career pathways.',
      fitReason: 'Projects and consistent fundamentals help prepare for digital services roles.',
      readinessAction: 'Complete one portfolio project and write a short project explanation.',
    },
  ],
}

function pickSubject(studentData, learningGap = '') {
  const scores = [
    { key: 'math', score: Number(studentData.mathScore) },
    { key: 'physics', score: Number(studentData.physicsScore) },
    { key: 'chemistry', score: Number(studentData.chemistryScore) },
  ]
  const gap = String(learningGap).toLowerCase()

  if (gap.includes('math')) return 'math'
  if (gap.includes('physics')) return 'physics'
  if (gap.includes('chemistry')) return 'chemistry'

  return scores.sort((a, b) => a.score - b.score)[0]?.key || 'general'
}

function normalizeResult(result) {
  return {
    title: String(result.title || 'Learning resource').trim(),
    url: String(result.url || '').trim(),
    content: String(result.content || '').replace(/\s+/g, ' ').trim().slice(0, 220),
    score: typeof result.score === 'number' ? result.score : null,
    favicon: result.favicon || '',
  }
}

function normalizeOpportunity(result, type) {
  return {
    ...normalizeResult(result),
    type,
  }
}

function fallbackResources(studentData, learningGap) {
  const subject = pickSubject(studentData, learningGap)
  return curatedResources[subject] || curatedResources.general
}

function fallbackOpportunities(studentData, learningGap) {
  const subject = pickSubject(studentData, learningGap)
  const opportunities = curatedOpportunities[subject] || curatedOpportunities.general
  const locationName = studentData.location?.label || studentData.location?.city || ''

  if (!locationName) return opportunities

  return opportunities.map((opportunity) => ({
    ...opportunity,
    content: `${opportunity.content} Also check local eligibility and nearby events around ${locationName}.`,
    locationMatched: true,
  }))
}

function strongestSubject(studentData) {
  const scores = [
    { key: 'math', label: 'Math', score: Number(studentData.mathScore || 0) },
    { key: 'physics', label: 'Physics', score: Number(studentData.physicsScore || 0) },
    { key: 'chemistry', label: 'Chemistry', score: Number(studentData.chemistryScore || 0) },
  ]

  return scores.sort((a, b) => b.score - a.score)[0] || scores[0]
}

function fallbackCompanyRecommendations(studentData) {
  const strongest = strongestSubject(studentData)
  return curatedCompanyRecommendations[strongest.key] || curatedCompanyRecommendations.general
}

function inferCompanyName(title = '') {
  const cleanTitle = String(title).replace(/\s+/g, ' ').trim()
  const knownCompanies = [
    'Google',
    'Microsoft',
    'Amazon',
    'Tesla',
    'Siemens',
    'TCS',
    'Infosys',
    'Wipro',
    'IBM',
    'Biocon',
    'Dr. Reddy',
    'ISRO',
    'Intel',
    'NVIDIA',
  ]
  const match = knownCompanies.find((company) => cleanTitle.toLowerCase().includes(company.toLowerCase()))

  return match || cleanTitle.split(/[-|:]/)[0].slice(0, 48) || 'Company'
}

function getMaxResults() {
  const value = Number(process.env.TAVILY_MAX_RESULTS || 4)
  if (!Number.isFinite(value)) return 4
  return Math.min(Math.max(Math.trunc(value), 1), 10)
}

export async function findLearningResources(studentData, analysis) {
  const fallback = fallbackResources(studentData, analysis?.learningGap)

  if (!process.env.TAVILY_API_KEY) {
    return fallback
  }

  const subject = pickSubject(studentData, analysis?.learningGap)
  const query = [
    `Grade ${studentData.grade}`,
    subject,
    analysis?.learningGap,
    'student study resources practice examples',
  ]
    .filter(Boolean)
    .join(' ')

  try {
    const response = await axios.post(
      TAVILY_URL,
      {
        query,
        topic: 'general',
        search_depth: process.env.TAVILY_SEARCH_DEPTH || 'basic',
        max_results: getMaxResults(),
        include_answer: false,
        include_favicon: true,
        safe_search: true,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.TAVILY_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 15000,
      },
    )

    const resources = (response.data?.results || [])
      .map(normalizeResult)
      .filter((resource) => resource.title && resource.url)
      .slice(0, 4)

    return resources.length ? resources : fallback
  } catch (error) {
    console.error('Tavily resource lookup failed:', error.response?.data || error.message)
    return fallback
  }
}

export async function findStudentOpportunities(studentData, analysis) {
  const fallback = fallbackOpportunities(studentData, analysis?.learningGap)

  if (!process.env.TAVILY_API_KEY) {
    return fallback
  }

  const subject = pickSubject(studentData, analysis?.learningGap)
  const grade = studentData.grade || 'school'
  const locationName = studentData.location?.label || studentData.location?.city || ''
  const locationQuery = locationName
    ? `near ${locationName}`
    : studentData.location?.latitude && studentData.location?.longitude
      ? `near latitude ${studentData.location.latitude} longitude ${studentData.location.longitude}`
      : 'India'
  const average = Math.round(
    (Number(studentData.mathScore || 0) + Number(studentData.physicsScore || 0) + Number(studentData.chemistryScore || 0)) / 3,
  )
  const scholarshipQuery = [
    `current scholarships for Grade ${grade} students ${locationQuery}`,
    average >= 75 ? 'merit scholarship school students' : 'financial aid scholarship school students',
    subject,
  ].join(' ')
  const eventQuery = [
    `current student competitions events Grade ${grade} ${locationQuery}`,
    subject,
    'olympiad hackathon science fair participation nearby local',
  ].join(' ')

  try {
    const [scholarshipResponse, eventResponse] = await Promise.all([
      axios.post(
        TAVILY_URL,
        {
          query: scholarshipQuery,
          topic: 'general',
          search_depth: process.env.TAVILY_SEARCH_DEPTH || 'basic',
          max_results: 2,
          include_answer: false,
          include_favicon: true,
          safe_search: true,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.TAVILY_API_KEY}`,
            'Content-Type': 'application/json',
          },
          timeout: 15000,
        },
      ),
      axios.post(
        TAVILY_URL,
        {
          query: eventQuery,
          topic: 'general',
          search_depth: process.env.TAVILY_SEARCH_DEPTH || 'basic',
          max_results: 3,
          include_answer: false,
          include_favicon: true,
          safe_search: true,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.TAVILY_API_KEY}`,
            'Content-Type': 'application/json',
          },
          timeout: 15000,
        },
      ),
    ])

    const scholarships = (scholarshipResponse.data?.results || [])
      .map((result) => normalizeOpportunity(result, 'Scholarship'))
      .filter((item) => item.title && item.url)
    const events = (eventResponse.data?.results || [])
      .map((result) => normalizeOpportunity(result, 'Event'))
      .filter((item) => item.title && item.url)
    const opportunities = [...scholarships, ...events].slice(0, 5).map((opportunity) => ({
      ...opportunity,
      locationMatched: Boolean(studentData.location),
      locationLabel: locationName,
    }))

    return opportunities.length ? opportunities : fallback
  } catch (error) {
    console.error('Tavily opportunity lookup failed:', error.response?.data || error.message)
    return fallback
  }
}

export async function findCompanyRecommendations(studentData, analysis) {
  const fallback = fallbackCompanyRecommendations(studentData)

  if (!process.env.TAVILY_API_KEY) {
    return fallback
  }

  const strongest = strongestSubject(studentData)
  const weakSubject = pickSubject(studentData, analysis?.learningGap)
  const query = [
    'student career programs internships early career companies India',
    strongest.label,
    weakSubject,
    'apply careers company details eligibility skills',
  ].join(' ')

  try {
    const response = await axios.post(
      TAVILY_URL,
      {
        query,
        topic: 'general',
        search_depth: process.env.TAVILY_SEARCH_DEPTH || 'basic',
        max_results: 5,
        include_answer: false,
        include_favicon: true,
        safe_search: true,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.TAVILY_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 15000,
      },
    )

    const recommendations = (response.data?.results || [])
      .map((result) => {
        const normalized = normalizeResult(result)
        return {
          company: inferCompanyName(normalized.title),
          roleTrack:
            strongest.key === 'math'
              ? 'Software, data, analytics, and AI foundations'
              : strongest.key === 'physics'
                ? 'Engineering, robotics, systems, and energy'
                : 'Biotech, pharma, healthcare, and lab science',
          applyUrl: normalized.url,
          details: normalized.content || 'Career or student opportunity page for this organization.',
          fitReason: `${strongest.label} is the strongest academic signal, so this pathway matches the student's current profile.`,
          readinessAction: `Upload one ${strongest.label} project and improve ${weakSubject} fundamentals to strengthen eligibility.`,
          favicon: normalized.favicon,
        }
      })
      .filter((item) => item.company && item.applyUrl)
      .slice(0, 4)

    return recommendations.length ? recommendations : fallback
  } catch (error) {
    console.error('Tavily company recommendation lookup failed:', error.response?.data || error.message)
    return fallback
  }
}
