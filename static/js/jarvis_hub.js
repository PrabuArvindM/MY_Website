/* ==========================================================================
   PRABU ARVIND M - JARVIS AI INTELLIGENCE HUB ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  fetchJarvisHub();
  initJarvisSearch();
});

let jarvisHubData = null;

function fetchJarvisHub(query = '') {
  let url = '/api/jarvis/hub';
  if (query) {
    url += `?search=${encodeURIComponent(query)}`;
  }

  fetch(url)
    .then(res => res.json())
    .then(data => {
      jarvisHubData = data;
      renderJarvisHeader(data);
      renderNewsSection(data.news);
      renderPapersSection(data.papers);
      renderModelReleasesSection(data.model_releases);
      renderDailyLearningSection(data.daily_learning);
      renderTrendingToolsSection(data.trending_tools);
    })
    .catch(err => console.error("Error fetching Jarvis Hub data:", err));
}

function renderJarvisHeader(data) {
  const container = document.getElementById('jarvis-header-container');
  if (!container) return;

  container.innerHTML = `
    <div class="glass-card fade-in" style="padding: 28px; border: 1px solid var(--border-glow); box-shadow: var(--shadow-neon); margin-bottom: 40px; position: relative; overflow: hidden;">
      <div style="position: absolute; top: -50px; right: -50px; width: 200px; height: 200px; background: var(--accent-cyan); opacity: 0.1; filter: blur(40px); border-radius: 50%;"></div>
      
      <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 20px;">
        <div>
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
            <span class="badge" style="background: rgba(0, 242, 254, 0.15); color: var(--accent-cyan); border-color: var(--border-glow); font-size: 0.85rem; padding: 6px 14px;">
              🤖 Powered by Jarvis AI Agent 4.0
            </span>
            <span style="display: flex; align-items: center; gap: 6px; font-size: 0.8rem; color: var(--accent-green); font-family: var(--font-code);">
              <i class="fas fa-circle" style="font-size: 0.5rem; color: #00e676; animation: pulse 1.5s infinite;"></i> AGENT ACTIVE & SCANNING
            </span>
          </div>

          <h2 style="font-size: 2.2rem; margin-bottom: 6px;">AI Intelligence Hub</h2>
          <div style="color: var(--accent-cyan); font-weight: 600; font-size: 1rem; margin-bottom: 12px;">Daily AI Research • Technology Updates • Engineering Insights</div>
          
          <p style="color: var(--text-muted); font-size: 0.92rem; max-width: 700px; line-height: 1.6;">
            Jarvis continuously scans trusted AI research repositories, arXiv papers, Hugging Face releases, and tech blogs, generating concise real-time intelligence for engineers and researchers.
          </p>
        </div>

        <div style="background: rgba(7, 9, 19, 0.8); padding: 18px 24px; border-radius: var(--radius-md); border: 1px solid var(--border-glass); text-align: right; min-width: 220px;">
          <div style="font-size: 0.75rem; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">Last Updated</div>
          <div style="font-size: 1.1rem; font-weight: 700; color: var(--accent-cyan); font-family: var(--font-code);">${data.last_updated_date}</div>
          <div style="font-size: 0.85rem; color: var(--text-muted); font-family: var(--font-code);">${data.last_updated_time}</div>
          <button class="btn btn-outline" style="margin-top: 10px; padding: 4px 12px; font-size: 0.75rem; width: 100%;" onclick="triggerJarvisManually()"><i class="fas fa-sync-alt"></i> Trigger Jarvis Agent</button>
        </div>
      </div>
    </div>
  `;
}

// 1. TODAY'S AI NEWS
function renderNewsSection(news) {
  const container = document.getElementById('jarvis-news-container');
  if (!container) return;

  if (!news || news.length === 0) {
    container.innerHTML = `<div style="color: var(--text-muted); text-align: center; padding: 20px;">No news items found.</div>`;
    return;
  }

  container.innerHTML = news.map(item => {
    const isBreak = item.is_breaking ? `<span class="badge" style="background: rgba(255, 0, 128, 0.2); color: #ff0080; border-color: rgba(255, 0, 128, 0.5);"><i class="fas fa-bolt"></i> BREAKING NEWS</span>` : '';
    const isNew = item.is_new ? `<span class="chip" style="font-size: 0.7rem; background: rgba(0, 242, 254, 0.15); color: var(--accent-cyan);">NEW</span>` : '';

    return `
      <div class="glass-card fact-card fade-in" style="padding: 24px; display: flex; flex-direction: column; justify-content: space-between; border: 1px solid var(--border-glass);">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <i class="${item.logo_icon}" style="font-size: 1.5rem; color: var(--accent-cyan);"></i>
              <span style="font-weight: 700; font-size: 0.95rem; color: var(--text-main);">${item.company}</span>
            </div>
            <div style="display: flex; gap: 6px;">
              ${isBreak}
              ${isNew}
            </div>
          </div>

          <h3 style="font-size: 1.2rem; margin-bottom: 10px; line-height: 1.4; color: var(--text-main);">${item.headline}</h3>
          <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin-bottom: 18px;">${item.summary}</p>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 14px; border-top: 1px dashed var(--border-glass); font-size: 0.8rem;">
          <span style="color: var(--accent-cyan); font-weight: 600;">🔥 ${item.trending_score}/100 Score</span>
        </div>
      </div>
    `;
  }).join('');
}

// 2. TODAY'S RESEARCH PAPERS
function renderPapersSection(papers) {
  const container = document.getElementById('jarvis-papers-container');
  if (!container) return;

  if (!papers || papers.length === 0) {
    container.innerHTML = `<div style="color: var(--text-muted); text-align: center; padding: 20px;">No research papers found.</div>`;
    return;
  }

  container.innerHTML = papers.map(paper => {
    const diffColor = paper.difficulty === 'Beginner' ? '#00f2fe' : (paper.difficulty === 'Advanced' ? '#ff0080' : '#7928ca');

    return `
      <div class="glass-card fact-card fade-in" style="padding: 24px; display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <span class="badge" style="font-size: 0.75rem; border-color: ${diffColor}; color: ${diffColor};">${paper.difficulty}</span>
            <span style="font-size: 0.78rem; color: var(--text-dim);"><i class="far fa-calendar-alt"></i> ${paper.published_date}</span>
          </div>

          <h3 style="font-size: 1.15rem; margin-bottom: 8px; color: var(--text-main); line-height: 1.4;">${paper.title}</h3>
          <div style="font-size: 0.82rem; color: var(--accent-cyan); margin-bottom: 12px;"><i class="fas fa-user-edit"></i> ${paper.authors}</div>
          
          <div style="background: rgba(255,255,255,0.02); padding: 14px; border-radius: var(--radius-sm); border: 1px solid var(--border-glass); margin-bottom: 18px;">
            <div style="font-size: 0.75rem; color: var(--accent-cyan); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">🤖 Jarvis AI Summary</div>
            <p style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.6;">${paper.ai_summary}</p>
          </div>
        </div>

        <div style="display: flex; gap: 10px;">
          <a href="${paper.pdf_url}" target="_blank" class="btn btn-primary" style="flex: 1; padding: 8px 12px; font-size: 0.8rem; text-align: center;"><i class="fas fa-file-pdf"></i> Direct PDF</a>
          <button class="btn btn-outline" style="padding: 8px 12px; font-size: 0.8rem;" onclick="showPaperModal('${encodeURIComponent(paper.title)}', '${encodeURIComponent(paper.ai_summary)}')">Read Summary</button>
        </div>
      </div>
    `;
  }).join('');
}

// 3. MODEL RELEASE TRACKER
function renderModelReleasesSection(releases) {
  const container = document.getElementById('jarvis-releases-container');
  if (!container) return;

  if (!releases || releases.length === 0) {
    container.innerHTML = `<div style="color: var(--text-muted); text-align: center; padding: 20px;">No model releases tracked today.</div>`;
    return;
  }

  container.innerHTML = releases.map(r => `
    <div class="glass-card roadmap-card fade-in" style="text-align: left; padding: 20px; min-width: 260px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
        <span class="roadmap-year" style="font-size: 0.85rem;"><i class="far fa-clock"></i> ${r.release_date}</span>
        <i class="${r.logo_icon}" style="font-size: 1.2rem; color: var(--accent-cyan);"></i>
      </div>
      <h4 style="font-size: 1.15rem; margin-bottom: 4px; color: var(--text-main);">${r.model_name}</h4>
      <div style="font-size: 0.82rem; color: var(--accent-cyan); font-weight: 600; margin-bottom: 12px;">${r.company}</div>

      <div style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 8px;">
        <strong>Key Features:</strong> ${r.key_features}
      </div>
      <div style="font-size: 0.82rem; color: var(--accent-green);">
        <strong>Improvements:</strong> ${r.improvements}
      </div>
    </div>
  `).join('');
}

// 4. LEARN TODAY (JARVIS DAILY MASTERCLASS)
function renderDailyLearningSection(article) {
  const container = document.getElementById('jarvis-daily-learning-container');
  if (!container || !article) return;

  container.innerHTML = `
    <div class="glass-card fade-in" style="padding: 32px; border: 1px solid var(--border-glow); box-shadow: var(--shadow-neon);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
        <div style="display: flex; gap: 10px; align-items: center;">
          <span class="section-tag"><i class="fas fa-graduation-cap"></i> TODAY'S MASTERCLASS</span>
          <span class="badge" style="background: rgba(121, 40, 202, 0.2); color: var(--accent-violet); border-color: rgba(121, 40, 202, 0.4);">${article.difficulty}</span>
        </div>
        <span style="font-size: 0.85rem; color: var(--text-muted); font-family: var(--font-code);"><i class="far fa-clock"></i> ${article.read_time}</span>
      </div>

      <h2 style="font-size: 1.9rem; margin-bottom: 14px; color: var(--text-main);">${article.title}</h2>
      <p style="color: var(--text-muted); font-size: 0.98rem; line-height: 1.7; margin-bottom: 24px;">${article.overview}</p>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px;">
        <div style="background: rgba(255,255,255,0.02); padding: 18px; border-radius: var(--radius-md); border: 1px solid var(--border-glass);">
          <h4 style="color: var(--accent-cyan); font-size: 0.95rem; margin-bottom: 8px;"><i class="fas fa-sitemap"></i> Architecture Paradigm</h4>
          <p style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.6;">${article.architecture}</p>
        </div>

        <div style="background: rgba(255,255,255,0.02); padding: 18px; border-radius: var(--radius-md); border: 1px solid var(--border-glass);">
          <h4 style="color: var(--accent-cyan); font-size: 0.95rem; margin-bottom: 8px;"><i class="fas fa-lightbulb"></i> Real-World Production Examples</h4>
          <p style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.6;">${article.real_examples}</p>
        </div>
      </div>

      <button class="btn btn-primary" style="padding: 12px 28px; font-size: 0.95rem;" onclick="openMasterclassModal()"><i class="fas fa-book-open"></i> Open Full Masterclass & Code Snippets</button>
    </div>
  `;
}

// 5. TRENDING AI TOOLS
function renderTrendingToolsSection(tools) {
  const container = document.getElementById('jarvis-tools-container');
  if (!container) return;

  if (!tools || tools.length === 0) {
    container.innerHTML = `<div style="color: var(--text-muted); text-align: center; padding: 20px;">No tools tracked today.</div>`;
    return;
  }

  container.innerHTML = tools.map(t => `
    <div class="glass-card fact-card fade-in" style="padding: 20px; text-align: left; display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <i class="${t.logo_icon}" style="font-size: 1.6rem; color: var(--accent-cyan);"></i>
          <span class="chip" style="font-size: 0.72rem; background: rgba(0, 242, 254, 0.12); color: var(--accent-cyan);">${t.popularity}</span>
        </div>

        <h3 style="font-size: 1.15rem; margin-bottom: 6px; color: var(--text-main);">${t.name}</h3>
        <p style="color: var(--text-muted); font-size: 0.85rem; line-height: 1.5; margin-bottom: 16px;">${t.description}</p>
      </div>

      <a href="${t.website_url}" target="_blank" class="btn btn-outline" style="padding: 6px 12px; font-size: 0.78rem; text-align: center; margin-top: auto;">Try Tool <i class="fas fa-external-link-alt"></i></a>
    </div>
  `).join('');
}

function initJarvisSearch() {
  const input = document.getElementById('jarvis-search-input');
  if (!input) return;

  let timeout = null;
  input.addEventListener('input', (e) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fetchJarvisHub(e.target.value), 300);
  });
}

function triggerJarvisManually() {
  fetch('/api/jarvis/trigger', {
    method: 'POST',
    headers: { 'X-Admin-Passcode': 'PrabuAI2026AdminPass' }
  })
    .then(res => res.json())
    .then(data => {
      showToast("Jarvis AI Agent scan triggered successfully!");
      fetchJarvisHub();
    })
    .catch(err => showToast("Failed to trigger Jarvis Agent", "error"));
}

function showPaperModal(encodedTitle, encodedSummary) {
  const title = decodeURIComponent(encodedTitle);
  const summary = decodeURIComponent(encodedSummary);

  const modal = document.getElementById('blog-modal');
  const content = document.getElementById('blog-modal-body');
  if (!modal || !content) return;

  content.innerHTML = `
    <h2 style="font-size: 1.8rem; margin-bottom: 16px; color: var(--text-main);">${title}</h2>
    <div style="background: rgba(0,242,254,0.05); padding: 20px; border-radius: var(--radius-md); border: 1px dashed var(--border-glow); margin-bottom: 24px;">
      <h4 style="color: var(--accent-cyan); margin-bottom: 10px;"><i class="fas fa-robot"></i> Jarvis AI Research Breakdown</h4>
      <p style="font-size: 0.98rem; color: var(--text-muted); line-height: 1.7;">${summary}</p>
    </div>
    <button class="btn btn-primary" onclick="closeBlogModal()">Close Summary</button>
  `;
  modal.classList.add('active');
}

function openMasterclassModal() {
  if (!jarvisHubData || !jarvisHubData.daily_learning) return;
  const dl = jarvisHubData.daily_learning;

  const modal = document.getElementById('blog-modal');
  const content = document.getElementById('blog-modal-body');
  if (!modal || !content) return;

  content.innerHTML = `
    <div style="margin-bottom: 20px; display: flex; gap: 10px; align-items: center;">
      <span class="section-tag">${dl.topic}</span>
      <span class="badge" style="color: var(--accent-cyan); border-color: var(--border-glow);">${dl.difficulty}</span>
      <span style="font-size: 0.85rem; color: var(--text-muted);"><i class="far fa-clock"></i> ${dl.read_time}</span>
    </div>

    <h1 style="font-size: 2.2rem; margin-bottom: 20px;">${dl.title}</h1>

    <div style="line-height: 1.8; font-size: 1rem; color: var(--text-main); margin-bottom: 30px;">
      <h3 style="color: var(--accent-cyan); margin-bottom: 10px;">1. Overview</h3>
      <p style="margin-bottom: 24px; color: var(--text-muted);">${dl.overview}</p>

      <h3 style="color: var(--accent-cyan); margin-bottom: 10px;">2. Architecture & Design</h3>
      <p style="margin-bottom: 24px; color: var(--text-muted);">${dl.architecture}</p>

      <h3 style="color: var(--accent-cyan); margin-bottom: 10px;">3. Code Snippet</h3>
      <pre style="background: rgba(0,0,0,0.6); padding: 20px; border-radius: var(--radius-sm); border: 1px solid var(--border-glass); overflow-x: auto; margin-bottom: 24px;"><code class="language-python" style="color: var(--accent-cyan);">${dl.code_snippet}</code></pre>

      <h3 style="color: var(--accent-cyan); margin-bottom: 10px;">4. Advantages & Key Benefits</h3>
      <p style="margin-bottom: 24px; color: var(--text-muted); whitespace-line: pre-line;">${dl.advantages}</p>

      <h3 style="color: var(--accent-cyan); margin-bottom: 10px;">5. Engineering Limitations</h3>
      <p style="margin-bottom: 24px; color: var(--text-muted); whitespace-line: pre-line;">${dl.limitations}</p>

      <h3 style="color: var(--accent-cyan); margin-bottom: 10px;">6. Technical Interview Questions</h3>
      <p style="margin-bottom: 24px; color: var(--text-muted); whitespace-line: pre-line;">${dl.interview_questions}</p>

      <h3 style="color: var(--accent-cyan); margin-bottom: 10px;">7. Recommended Resources</h3>
      <p style="color: var(--text-muted); whitespace-line: pre-line;">${dl.resources}</p>
    </div>

    <button class="btn btn-primary" onclick="closeBlogModal()">Close Masterclass</button>
  `;

  modal.classList.add('active');
}
