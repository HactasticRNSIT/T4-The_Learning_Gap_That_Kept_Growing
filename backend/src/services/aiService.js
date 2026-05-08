import axios from 'axios'

const SARVAM_URL = 'https://api.sarvam.ai/v1/chat/completions'

function normalizeRiskLevel(value) {
  const risk = String(value || '').toLowerCase()

  if (risk.includes('high')) return 'High'
  if (risk.includes('moderate') || risk.includes('medium')) return 'Moderate'
  return 'Safe'
}

function extractJson(content) {
  if (!content) {
    throw new Error('Sarvam AI returned an empty response')
  }

  const cleaned = String(content)
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim()

  const firstBrace = cleaned.indexOf('{')
  const lastBrace = cleaned.lastIndexOf('}')

  if (firstBrace === -1 || lastBrace === -1) {
    throw new Error('Sarvam AI response did not contain JSON')
  }

  return JSON.parse(cleaned.slice(firstBrace, lastBrace + 1))
}

function fallbackAnalysis(studentData) {
  const attendance = Number(studentData.attendance)
  const scores = [
    Number(studentData.mathScore),
    Number(studentData.physicsScore),
    Number(studentData.chemistryScore),
  ]
  const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length
  const weakestScore = Math.min(...scores)
  const weakestSubject = ['Math', 'Physics', 'Chemistry'][scores.indexOf(weakestScore)]

  let riskLevel = 'Safe'
  if (attendance < 75 || averageScore < 50 || weakestScore < 40) {
    riskLevel = 'High'
  } else if (attendance < 85 || averageScore < 68 || weakestScore < 55) {
    riskLevel = 'Moderate'
  }

  return {
    riskLevel,
    learningGap: `${weakestSubject} fundamentals and connected problem-solving concepts`,
    recommendation:
      riskLevel === 'High'
        ? `Schedule a parent-teacher intervention, daily ${weakestSubject} practice, and a weekly progress review.`
        : riskLevel === 'Moderate'
          ? `Assign targeted ${weakestSubject} remediation, peer support, and short weekly concept checks.`
          : `Maintain current pace with enrichment tasks and periodic review of ${weakestSubject}.`,
  }
}

export async function analyzeStudentWithAI(studentData) {
  if (!process.env.SARVAM_API_KEY) {
    return fallbackAnalysis(studentData)
  }

  const prompt = `
Analyze this student's academic data for a teacher intervention dashboard.

Student:
- Name: ${studentData.name}
- Grade: ${studentData.grade}
- Attendance Percent: ${studentData.attendance}
- Math Score: ${studentData.mathScore}
- Physics Score: ${studentData.physicsScore}
- Chemistry Score: ${studentData.chemistryScore}
- Teacher Remarks: ${studentData.remarks}

Return only valid JSON with exactly these keys:
{
  "riskLevel": "High | Moderate | Safe",
  "learningGap": "specific weak concepts",
  "recommendation": "specific teacher intervention plan"
}
`

  try {
    const response = await axios.post(
      SARVAM_URL,
      {
        model: process.env.SARVAM_MODEL || 'sarvam-m',
        messages: [
          {
            role: 'system',
            content:
              'You are an educational risk analyst. Return compact valid JSON only. Do not include markdown.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.2,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'api-subscription-key': process.env.SARVAM_API_KEY,
        },
        timeout: 25000,
      },
    )

    const content = response.data?.choices?.[0]?.message?.content
    const analysis = extractJson(content)

    return {
      riskLevel: normalizeRiskLevel(analysis.riskLevel),
      learningGap: String(analysis.learningGap || fallbackAnalysis(studentData).learningGap),
      recommendation: String(analysis.recommendation || fallbackAnalysis(studentData).recommendation),
    }
  } catch (error) {
    console.error('Sarvam AI analysis failed:', error.response?.data || error.message)
    return fallbackAnalysis(studentData)
  }
}
