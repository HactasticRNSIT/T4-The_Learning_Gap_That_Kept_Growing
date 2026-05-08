// backend/src/services/aiService.js

import axios from 'axios'

export const analyzeStudentWithAI =
  async (studentData) => {

    try {

      const prompt = `

Analyze this student academic data.

Student Details:
Name: ${studentData.name}
Grade: ${studentData.grade}
Attendance: ${studentData.attendance}
Math Score: ${studentData.mathScore}
Physics Score: ${studentData.physicsScore}
Chemistry Score: ${studentData.chemistryScore}
Teacher Remarks: ${studentData.remarks}

Generate:
1. riskLevel
2. learningGap
3. recommendation

Respond ONLY in JSON format.

Example:
{
  "riskLevel": "High",
  "learningGap": "Algebra Fundamentals",
  "recommendation": "Daily algebra revision needed"
}

`

      const response =
        await axios.post(

          'https://api.sarvam.ai/v1/chat/completions',

          {

            model: 'sarvam-m',

            messages: [

              {
                role: 'user',
                content: prompt
              }

            ],

            temperature: 0.3

          },

          {

            headers: {

              'Content-Type':
                'application/json',

              'api-subscription-key':
                process.env.SARVAM_API_KEY

            }

          }

        )

      const content =
        response.data
          .choices[0]
          .message
          .content

      return JSON.parse(content)

    } catch (error) {

      console.log(error)

      return {

        riskLevel: 'Moderate',

        learningGap:
          'General Conceptual Weakness',

        recommendation:
          'Needs additional mentoring'

      }

    }

}