/* ==========================================================================
   PRABU ARVIND M - JARVIS AI INTELLIGENCE CENTER DASHBOARD
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  fetchJarvisDashboard();
});

let currentDashboardData = null;

function fetchJarvisDashboard(targetDate = '') {
  let url = '/api/jarvis/dashboard';
  if (targetDate) {
    url += `?date=${encodeURIComponent(targetDate)}`;
  }

  fetch(url)
    .then(res => res.json())
    .then(data => {
      currentDashboardData = data;
      renderJarvisHeader(data);
      renderTopNews(data.top_news);
      renderModelReleases(data.model_releases);
      renderResearchPapers(data.research_papers);
      renderToolAndTerm(data.daily_tool, data.daily_term);
      renderJarvisReport(data.full_report_md);
    })
    .catch(err => console.error("Error loading Jarvis Intelligence Center:", err));
}

function renderJarvisHeader(data) {
  const container = document.getElementById('jarvis-header-container');
  if (!container) return;

  container.innerHTML = `
    <div class="glass-card fade-in" style="padding: 28px; border: 1px solid var(--border-glow); box-shadow: var(--shadow-neon); margin-bottom: 30px;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 20px;">
        <div>
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 10px; flex-wrap: wrap;">
            <span class="badge" style="background: rgba(0, 242, 254, 0.15); color: var(--accent-cyan); border-color: var(--border-glow); font-size: 0.85rem; padding: 6px 14px;">
              🤖 Powered by Jarvis AI Agent
            </span>
            <span style="font-size: 0.82rem; color: var(--accent-green); font-family: var(--font-code); display: flex; align-items: center; gap: 6px;">
              <i class="fas fa-circle" style="font-size: 0.5rem; color: #00e676; animation: pulse 1.5s infinite;"></i> Jarvis Status: ONLINE
            </span>
          </div>

          <h1 style="font-size: 2.3rem; margin-bottom: 6px; color: var(--text-main);">AI Intelligence Center</h1>
          <p style="color: var(--accent-cyan); font-weight: 600; font-size: 0.98rem; margin-bottom: 14px;">
            Jarvis continuously monitors the global AI ecosystem and automatically summarizes the latest developments.
          </p>
        </div>

        <div style="background: rgba(7, 9, 19, 0.8); padding: 18px 24px; border-radius: var(--radius-md); border: 1px solid var(--border-glass); min-width: 240px;">
          <div style="font-size: 0.78rem; color: var(--text-dim); text-transform: uppercase; margin-bottom: 4px;">Update Status</div>
          <div style="font-size: 1rem; font-weight: 700; color: var(--accent-cyan); font-family: var(--font-code);">${data.report_date}</div>
          <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 4px; font-family: var(--font-code);">Frequency: <span style="color: var(--accent-green);">Updated Daily</span></div>
          <button class="btn btn-outline" style="margin-top: 10px; padding: 6px 14px; font-size: 0.75rem; width: 100%;" onclick="triggerJarvisManually()"><i class="fas fa-sync-alt"></i> Refresh News</button>
        </div>
      </div>

      <hr style="border-color: var(--border-glass); margin: 20px 0;" />

      <!-- Scan Metrics Bar -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; font-size: 0.88rem;">
        <div style="background: rgba(255,255,255,0.02); padding: 12px 16px; border-radius: var(--radius-sm); border: 1px solid var(--border-glass);">
          <div style="color: var(--text-dim); font-size: 0.75rem;">Stories Analyzed</div>
          <div style="font-size: 1.2rem; font-weight: 700; color: var(--accent-cyan);">${data.stories_count} Stories</div>
        </div>
        <div style="background: rgba(255,255,255,0.02); padding: 12px 16px; border-radius: var(--radius-sm); border: 1px solid var(--border-glass);">
          <div style="color: var(--text-dim); font-size: 0.75rem;">Research Papers</div>
          <div style="font-size: 1.2rem; font-weight: 700; color: var(--accent-violet);">${data.papers_count} Papers</div>
        </div>
        <div style="background: rgba(255,255,255,0.02); padding: 12px 16px; border-radius: var(--radius-sm); border: 1px solid var(--border-glass);">
          <div style="color: var(--text-dim); font-size: 0.75rem;">Trending Company</div>
          <div style="font-size: 1.1rem; font-weight: 700; color: var(--text-main);">${data.trending_company}</div>
        </div>
        <div style="background: rgba(255,255,255,0.02); padding: 12px 16px; border-radius: var(--radius-sm); border: 1px solid var(--border-glass);">
          <div style="color: var(--text-dim); font-size: 0.75rem;">Trending Model</div>
          <div style="font-size: 1.1rem; font-weight: 700; color: var(--accent-pink);">${data.trending_model}</div>
        </div>
      </div>
    </div>
  `;
}

// 1. TODAY'S TOP NEWS (5 Stories)
function renderTopNews(news) {
  const container = document.getElementById('jarvis-top-news-container');
  if (!container) return;

  if (!news || news.length === 0) {
    container.innerHTML = `<div style="color: var(--text-muted); padding: 20px;">No top news available.</div>`;
    return;
  }

  container.innerHTML = news.map(item => `
    <div class="glass-card fact-card fade-in" style="padding: 24px; border: 1px solid var(--border-glass); margin-bottom: 20px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <i class="${item.logo_icon}" style="font-size: 1.5rem; color: var(--accent-cyan);"></i>
          <span style="font-weight: 700; font-size: 0.95rem; color: var(--text-main);">${item.company}</span>
        </div>
      </div>

      <h3 style="font-size: 1.25rem; margin-bottom: 10px; color: var(--text-main); line-height: 1.4;">${item.headline}</h3>
      <p style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; margin-bottom: 16px;">${item.summary}</p>

      <!-- Key New Features -->
      <div style="background: rgba(0, 242, 254, 0.03); padding: 14px 18px; border-radius: var(--radius-sm); border: 1px dashed var(--border-glow); margin-bottom: 16px;">
        <div style="font-size: 0.8rem; color: var(--accent-cyan); font-weight: 700; margin-bottom: 8px; text-transform: uppercase;">✨ New Features & Capabilities</div>
        <ul style="list-style: none; font-size: 0.88rem; color: var(--text-main); line-height: 1.7; padding-left: 0;">
          ${item.new_features.map(f => `<li>• ${f}</li>`).join('')}
        </ul>
      </div>

      <div style="font-size: 0.85rem; color: var(--text-muted);">
        <strong>Why it matters:</strong> ${item.why_it_matters}
      </div>
    </div>
  `;
iv>
  `).join('');
}

// 2. MODEL RELEASES
function renderModelReleases(releases) {
  const container = document.getElementById('jarvis-releases-container');
  if (!container) return;

  container.innerHTML = releases.map(r => `
    <div class="glass-card fact-card" style="padding: 16px; border: 1px solid var(--border-glass);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
        <span style="font-weight: 700; color: var(--text-main); font-size: 1rem;">${r.model}</span>
        <span class="chip" style="font-size: 0.7rem;">${r.release_date}</span>
      </div>
      <div style="font-size: 0.8rem; color: var(--accent-cyan); margin-bottom: 8px;">${r.company}</div>
      <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; margin: 0;">${r.improvements}</p>
    </div>
  `).join('');
}

// 3. RESEARCH PAPERS
function renderResearchPapers(papers) {
  const container = document.getElementById('jarvis-papers-container');
  if (!container) return;

  container.innerHTML = papers.map(p => {
    const diffColor = p.difficulty === 'Beginner' ? '#00f2fe' : (p.difficulty === 'Advanced' ? '#ff0080' : '#7928ca');

    return `
      <div class="glass-card fact-card" style="padding: 16px; border: 1px solid var(--border-glass);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
          <h4 style="font-size: 0.98rem; margin: 0; color: var(--text-main); line-height: 1.4;">${p.title}</h4>
          <span class="badge" style="font-size: 0.7rem; border-color: ${diffColor}; color: ${diffColor}; flex-shrink: 0; margin-left: 10px;">${p.difficulty}</span>
        </div>
        <div style="font-size: 0.78rem; color: var(--accent-cyan); margin-bottom: 8px;">${p.authors}</div>
        <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 12px;">${p.ai_summary}</p>
        <a href="${p.paper_url}" target="_blank" class="btn btn-outline" style="padding: 4px 10px; font-size: 0.75rem;"><i class="fas fa-file-pdf"></i> Read Paper</a>
      </div>
    `;
  }).join('');
}

// 4. TODAY'S TOOL & TODAY'S TERM
function renderToolAndTerm(tool, term) {
  const container = document.getElementById('jarvis-tool-term-container');
  if (!container) return;

  container.innerHTML = `
    <!-- Today's AI Tool -->
    <div class="glass-card fade-in" style="padding: 24px; border: 1px solid var(--border-glow);">
      <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
        <i class="${tool.logo_icon || 'fas fa-tools'}" style="font-size: 1.6rem; color: var(--accent-cyan);"></i>
        <div>
          <span class="section-tag" style="font-size: 0.75rem;">🛠️ TODAY'S FEATURED AI TOOL</span>
          <h3 style="font-size: 1.3rem; margin: 0;">${tool.name}</h3>
        </div>
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin-bottom: 12px;"><strong>Purpose:</strong> ${tool.purpose}</p>
      <div style="font-size: 0.88rem; color: var(--text-main); margin-bottom: 12px;"><strong>Key Features:</strong> ${tool.features}</div>
      <div style="font-size: 0.85rem; color: var(--text-dim); margin-bottom: 16px;"><strong>Target Audience:</strong> ${tool.who_should_use}</div>
      <a href="${tool.website_url}" target="_blank" class="btn btn-primary" style="padding: 8px 18px; font-size: 0.8rem;">Try ${tool.name} <i class="fas fa-external-link-alt"></i></a>
    </div>

    <!-- Today's AI Term -->
    <div class="glass-card fade-in" style="padding: 24px; border: 1px solid var(--border-glow);">
      <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
        <i class="fas fa-graduation-cap" style="font-size: 1.6rem; color: var(--accent-violet);"></i>
        <div>
          <span class="section-tag" style="font-size: 0.75rem; background: rgba(121,40,202,0.15); color: var(--accent-violet);">💡 TODAY'S AI CONCEPT</span>
          <h3 style="font-size: 1.3rem; margin: 0;">${term.term}</h3>
        </div>
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin-bottom: 16px;">${term.explanation}</p>
      <div style="background: rgba(0,0,0,0.6); padding: 14px; border-radius: var(--radius-sm); border: 1px solid var(--border-glass);">
        <div style="font-size: 0.75rem; color: var(--accent-cyan); margin-bottom: 6px; font-family: var(--font-code);">Python Code Example:</div>
        <pre style="margin: 0;"><code class="language-python" style="font-size: 0.82rem; color: var(--accent-cyan);">${term.example_code}</code></pre>
      </div>
    </div>
  `;
}

// 5. JARVIS DAILY INTELLIGENCE REPORT
function renderJarvisReport(reportMd) {
  const container = document.getElementById('jarvis-report-container');
  if (!container) return;

  // Simple Markdown Formatter
  let html = reportMd
    .replace(/^# (.*$)/gim, '<h2 style="font-size: 1.8rem; color: var(--accent-cyan); margin-bottom: 16px;">$1</h2>')
    .replace(/^## (.*$)/gim, '<h3 style="font-size: 1.3rem; color: var(--text-main); margin: 20px 0 10px 0;">$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n\n/g, '<br><br>');

  container.innerHTML = `
    <div class="glass-card fade-in" style="padding: 32px; border: 1px solid var(--border-glow); box-shadow: var(--shadow-neon);">
      <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px;">
        <i class="fas fa-file-alt" style="font-size: 1.5rem; color: var(--accent-cyan);"></i>
        <span class="section-tag">Jarvis Daily Intelligence Report</span>
      </div>
      <div style="line-height: 1.8; font-size: 1rem; color: var(--text-main);">
        ${html}
      </div>
    </div>
  `;
}

function switchArchiveDate(dateStr) {
  fetchJarvisDashboard(dateStr);
}

function triggerJarvisManually() {
  fetch('/api/jarvis/trigger', {
    method: 'POST',
    headers: { 'X-Admin-Passcode': 'PrabuAI2026AdminPass' }
  })
    .then(res => res.json())
    .then(data => {
      showToast("Jarvis AI Agent report generated & database refreshed!");
      fetchJarvisDashboard();
    })
    .catch(err => showToast("Failed to trigger Jarvis Agent", "error"));
}
