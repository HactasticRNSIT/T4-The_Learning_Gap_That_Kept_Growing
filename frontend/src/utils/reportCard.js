import { buildStudentProfile } from './academicIntelligence'

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function scoreRow(label, score) {
  const value = Number(score || 0)
  return `
    <tr>
      <td>${escapeHtml(label)}</td>
      <td>${value}%</td>
      <td>
        <div class="bar"><span style="width:${Math.max(0, Math.min(100, value))}%"></span></div>
      </td>
    </tr>
  `
}

function resourceRows(resources = []) {
  const visibleResources = Array.isArray(resources) ? resources.filter((resource) => resource?.url).slice(0, 4) : []

  if (!visibleResources.length) {
    return '<li>No web resources attached yet.</li>'
  }

  return visibleResources
    .map(
      (resource) => `
        <li>
          <a href="${escapeHtml(resource.url)}">${escapeHtml(resource.title || resource.url)}</a>
          ${resource.content ? `<span>${escapeHtml(resource.content)}</span>` : ''}
        </li>
      `,
    )
    .join('')
}

function opportunityRows(opportunities = []) {
  const visibleItems = Array.isArray(opportunities) ? opportunities.filter((item) => item?.title).slice(0, 5) : []

  if (!visibleItems.length) {
    return '<li>No scholarship or event recommendations attached yet.</li>'
  }

  return visibleItems
    .map(
      (item) => `
        <li>
          ${item.url ? `<a href="${escapeHtml(item.url)}">${escapeHtml(item.title)}</a>` : `<strong>${escapeHtml(item.title)}</strong>`}
          <em>${escapeHtml(item.type || 'Opportunity')}</em>
          ${item.content ? `<span>${escapeHtml(item.content)}</span>` : ''}
        </li>
      `,
    )
    .join('')
}

function projectRows(projects = []) {
  const visibleProjects = Array.isArray(projects) ? projects.slice(-5).reverse() : []

  if (!visibleProjects.length) {
    return '<li>No projects submitted yet.</li>'
  }

  return visibleProjects
    .map(
      (project) => `
        <li>
          ${project.projectUrl ? `<a href="${escapeHtml(project.projectUrl)}">${escapeHtml(project.title)}</a>` : `<strong>${escapeHtml(project.title)}</strong>`}
          <em>${escapeHtml(project.subject || 'Project')} - ${Number(project.pointsAwarded || 0)} star points</em>
          ${project.description ? `<span>${escapeHtml(project.description)}</span>` : ''}
        </li>
      `,
    )
    .join('')
}

function companyRows(companies = []) {
  const visibleCompanies = Array.isArray(companies) ? companies.filter((company) => company?.company).slice(0, 4) : []

  if (!visibleCompanies.length) {
    return '<li>No company-fit recommendations attached yet.</li>'
  }

  return visibleCompanies
    .map(
      (company) => `
        <li>
          ${company.applyUrl ? `<a href="${escapeHtml(company.applyUrl)}">${escapeHtml(company.company)}</a>` : `<strong>${escapeHtml(company.company)}</strong>`}
          <em>${escapeHtml(company.roleTrack || 'Career pathway')}</em>
          ${company.details ? `<span>${escapeHtml(company.details)}</span>` : ''}
          ${company.fitReason ? `<span><strong>Why it fits:</strong> ${escapeHtml(company.fitReason)}</span>` : ''}
          ${company.readinessAction ? `<span><strong>Next step:</strong> ${escapeHtml(company.readinessAction)}</span>` : ''}
        </li>
      `,
    )
    .join('')
}

export function buildReportCardHtml(studentRecord) {
  const student = buildStudentProfile(studentRecord)
  const generatedAt = new Date().toLocaleString()

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(student.name)} Report Card</title>
    <style>
      * { box-sizing: border-box; }
      body { margin: 0; background: #eef4f8; color: #122033; font-family: Inter, Arial, sans-serif; }
      main { max-width: 920px; margin: 32px auto; background: #fff; border: 1px solid #d7e1ea; border-radius: 12px; overflow: hidden; }
      header { padding: 28px 32px; background: #0f766e; color: #fff; }
      h1, h2, p { margin: 0; }
      h1 { font-size: 30px; }
      h2 { margin-bottom: 12px; font-size: 18px; color: #0f766e; }
      section { padding: 24px 32px; border-top: 1px solid #e5edf3; }
      .meta, .metrics { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-top: 20px; }
      .card { border: 1px solid #e5edf3; border-radius: 10px; padding: 14px; background: #f8fbfd; }
      .label { display: block; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; }
      .value { display: block; margin-top: 6px; font-size: 20px; font-weight: 800; color: #0f172a; }
      table { width: 100%; border-collapse: collapse; }
      td, th { padding: 12px; border-bottom: 1px solid #e5edf3; text-align: left; }
      th { color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; }
      .bar { height: 10px; border-radius: 999px; background: #e2e8f0; overflow: hidden; }
      .bar span { display: block; height: 100%; background: #14b8a6; }
      .narrative { line-height: 1.65; color: #334155; }
      ul { margin: 0; padding-left: 20px; }
      li { margin: 10px 0; }
      a { color: #0f766e; font-weight: 700; }
      li span { display: block; margin-top: 4px; color: #475569; line-height: 1.5; }
      li em { display: block; margin-top: 4px; color: #64748b; font-style: normal; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; }
      footer { padding: 18px 32px; color: #64748b; font-size: 12px; border-top: 1px solid #e5edf3; }
      @media print {
        body { background: #fff; }
        main { margin: 0; border: 0; border-radius: 0; }
      }
    </style>
  </head>
  <body>
    <main>
      <header>
        <h1>AstraLearn Report Card</h1>
        <p>Generated academic profile for ${escapeHtml(student.name)}</p>
        <div class="meta">
          <div class="card"><span class="label">Grade</span><span class="value">${escapeHtml(student.grade)}</span></div>
          <div class="card"><span class="label">Attendance</span><span class="value">${student.attendance}%</span></div>
          <div class="card"><span class="label">Average</span><span class="value">${student.average}%</span></div>
          <div class="card"><span class="label">Stars</span><span class="value">${Number(student.starPoints || 0)}</span></div>
        </div>
      </header>

      <section>
        <h2>Subject Performance</h2>
        <table>
          <thead><tr><th>Subject</th><th>Score</th><th>Mastery</th></tr></thead>
          <tbody>
            ${scoreRow('Math', student.mathScore)}
            ${scoreRow('Physics', student.physicsScore)}
            ${scoreRow('Chemistry', student.chemistryScore)}
          </tbody>
        </table>
      </section>

      <section>
        <h2>AI Summary</h2>
        <p class="narrative">
          ${escapeHtml(student.name)} has a current average of ${student.average}% with ${student.attendance}% attendance.
          The key learning gap is ${escapeHtml(student.learningGap || `${student.weakest.label} fundamentals`)}.
          Recommended action: ${escapeHtml(student.recommendation || 'Continue guided revision and weekly concept checks.')}
        </p>
      </section>

      <section>
        <h2>Growth Indicators</h2>
        <div class="metrics">
          <div class="card"><span class="label">Growth Score</span><span class="value">${student.growthScore}</span></div>
          <div class="card"><span class="label">Confidence</span><span class="value">${student.confidence}%</span></div>
          <div class="card"><span class="label">Recovery</span><span class="value">${student.interventionSuccess}%</span></div>
          <div class="card"><span class="label">Risk</span><span class="value">${escapeHtml(student.risk)}</span></div>
        </div>
      </section>

      <section>
        <h2>Project Portfolio</h2>
        <ul>${projectRows(student.projects)}</ul>
      </section>

      <section>
        <h2>Resources to Refer</h2>
        <ul>${resourceRows(student.resources)}</ul>
      </section>

      <section>
        <h2>Scholarships and Participation</h2>
        <ul>${opportunityRows(student.opportunities)}</ul>
      </section>

      <section>
        <h2>Company Fit and Apply Paths</h2>
        <ul>${companyRows(student.companyRecommendations)}</ul>
      </section>

      <footer>Generated by AstraLearn on ${escapeHtml(generatedAt)}. Open this report in a browser and use Print to save as PDF.</footer>
    </main>
  </body>
</html>`
}

export function downloadStudentReport(student) {
  const html = buildReportCardHtml(student)
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  const safeName = String(student.name || 'student').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  link.href = url
  link.download = `${safeName || 'student'}-report-card.html`
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
