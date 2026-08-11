/* ==========================================================================
   PRABU ARVIND M - JARVIS AI KNOWLEDGE HUB PORTAL ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  fetchDailyIntelligenceNews();
  fetchOCRGuide();
  fetchPegasusGuide();
});

function fetchDailyIntelligenceNews() {
  fetch('/api/jarvis-hub/news')
    .then(res => res.json())
    .then(data => renderDailyIntelligenceNews(data.news))
    .catch(err => console.error("Error loading JARVIS daily news:", err));
}

function renderDailyIntelligenceNews(news) {
  const container = document.getElementById('jarvis-news-grid');
  if (!container) return;

  if (!news || news.length === 0) {
    container.innerHTML = `<div style="color: var(--text-muted); text-align: center; padding: 20px;">No daily intelligence items available.</div>`;
    return;
  }

  container.innerHTML = news.map(item => {
    const tagsHtml = item.tags.split(',').map(t => `<span class="chip" style="font-size: 0.72rem; padding: 2px 8px;">${t.trim()}</span>`).join(' ');

    return `
      <div class="glass-card fact-card fade-in" style="padding: 26px; border: 1px solid var(--border-glass); margin-bottom: 24px; text-align: left;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 10px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span class="badge" style="background: rgba(0, 242, 254, 0.15); color: var(--accent-cyan); border-color: var(--border-glow); font-size: 0.78rem;">
              <i class="fas fa-satellite-dish"></i> ${item.source_name}
            </span>
            <span style="font-size: 0.8rem; color: var(--text-dim);"><i class="far fa-calendar-alt"></i> ${item.pub_date}</span>
          </div>
          <span style="font-size: 0.8rem; color: var(--text-muted); font-family: var(--font-code);"><i class="far fa-clock"></i> ${item.read_time}</span>
        </div>

        <h3 style="font-size: 1.3rem; margin-bottom: 12px; color: var(--text-main); line-height: 1.4;">${item.headline}</h3>
        
        <div style="background: rgba(255,255,255,0.02); padding: 16px; border-radius: var(--radius-sm); border: 1px solid var(--border-glass); margin-bottom: 16px;">
          <div style="font-size: 0.75rem; color: var(--accent-cyan); text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em; margin-bottom: 6px;">🤖 JARVIS OpenRouter Summary</div>
          <p style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; margin: 0;">${item.summary}</p>
        </div>

        <div style="margin-bottom: 16px;">
          <div style="font-size: 0.85rem; color: var(--accent-cyan); font-weight: 700; margin-bottom: 6px;">💡 Why it matters:</div>
          <p style="color: var(--text-main); font-size: 0.9rem; line-height: 1.6; margin: 0;">${item.why_it_matters}</p>
        </div>

        <div style="background: rgba(121, 40, 202, 0.05); padding: 14px 18px; border-radius: var(--radius-sm); border: 1px dashed rgba(121, 40, 202, 0.3); margin-bottom: 18px;">
          <div style="font-size: 0.8rem; color: var(--accent-violet); font-weight: 700; margin-bottom: 8px;">🔑 Key Takeaways:</div>
          <ul style="list-style: none; padding-left: 0; margin: 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.7;">
            ${item.key_takeaways.map(k => `<li>• ${k}</li>`).join('')}
          </ul>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; padding-top: 14px; border-top: 1px dashed var(--border-glass);">
          <div style="display: flex; gap: 6px; flex-wrap: wrap;">${tagsHtml}</div>
        </div>
      </div>
    `;
  }).join('');
}

function fetchOCRGuide() {
  fetch('/api/jarvis-hub/ocr-guide')
    .then(res => res.json())
    .then(data => renderOCRGuide(data))
    .catch(err => console.error("Error loading OCR Guide:", err));
}

function renderOCRGuide(data) {
  const container = document.getElementById('ocr-guide-container');
  if (!container) return;

  let sectionsHtml = data.sections.map(s => {
    let content = s.content ? `<p style="line-height: 1.8; color: var(--text-muted); font-size: 0.95rem; whitespace-line: pre-line;">${s.content}</p>` : '';
    
    let tableHtml = '';
    if (s.comparison_table) {
      tableHtml = `
        <div style="overflow-x: auto; margin-top: 16px;">
          <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.85rem; color: var(--text-main);">
            <thead>
              <tr style="border-bottom: 2px solid var(--accent-cyan); background: rgba(0,242,254,0.08);">
                <th style="padding: 10px;">Model</th>
                <th style="padding: 10px;">Architecture</th>
                <th style="padding: 10px;">Inference Speed</th>
                <th style="padding: 10px;">Accuracy</th>
                <th style="padding: 10px;">Best For</th>
              </tr>
            </thead>
            <tbody>
              ${s.comparison_table.map(row => `
                <tr style="border-bottom: 1px solid var(--border-glass);">
                  <td style="padding: 10px; font-weight: 700; color: var(--accent-cyan);">${row.model}</td>
                  <td style="padding: 10px; color: var(--text-muted);">${row.architecture}</td>
                  <td style="padding: 10px; color: var(--accent-green); font-family: var(--font-code);">${row.speed}</td>
                  <td style="padding: 10px; font-weight: 600;">${row.accuracy}</td>
                  <td style="padding: 10px; color: var(--text-dim);">${row.best_for}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    }

    return `
      <div style="margin-bottom: 28px;">
        <h3 style="font-size: 1.25rem; color: var(--accent-cyan); margin-bottom: 10px;">${s.heading}</h3>
        ${content}
        ${tableHtml}
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div class="glass-card fade-in" style="padding: 32px; border: 1px solid var(--border-glow); box-shadow: var(--shadow-neon);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
        <span class="section-tag"><i class="fas fa-file-invoice"></i> SECTION 2: COMPLETE EDUCATIONAL GUIDE</span>
        <div style="display: flex; gap: 10px;">
          <span class="badge" style="background: rgba(0,242,254,0.15); color: var(--accent-cyan);">${data.difficulty}</span>
          <span style="font-size: 0.85rem; color: var(--text-muted);"><i class="far fa-clock"></i> ${data.read_time}</span>
        </div>
      </div>

      <h2 style="font-size: 2.1rem; margin-bottom: 8px; color: var(--text-main);">${data.title}</h2>
      <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 24px;">${data.subtitle}</p>

      <!-- Workflow Diagram Box -->
      <div style="background: rgba(0,0,0,0.6); padding: 20px; border-radius: var(--radius-md); border: 1px solid var(--border-glow); margin-bottom: 30px;">
        <div style="font-size: 0.8rem; color: var(--accent-cyan); font-weight: 700; text-transform: uppercase; margin-bottom: 10px;"><i class="fas fa-project-diagram"></i> OCR Production Architecture Workflow</div>
        <pre style="margin: 0; overflow-x: auto;"><code class="language-plaintext" style="font-size: 0.85rem; color: var(--accent-cyan); font-family: var(--font-code); line-height: 1.6;">${data.workflow_diagram}</code></pre>
      </div>

      ${sectionsHtml}
    </div>
  `;
}

function fetchPegasusGuide() {
  fetch('/api/jarvis-hub/pegasus-guide')
    .then(res => res.json())
    .then(data => renderPegasusGuide(data))
    .catch(err => console.error("Error loading PEGASUS Guide:", err));
}

function renderPegasusGuide(data) {
  const container = document.getElementById('pegasus-guide-container');
  if (!container) return;

  let sectionsHtml = data.sections.map(s => {
    let content = s.content ? `<p style="line-height: 1.8; color: var(--text-muted); font-size: 0.95rem; whitespace-line: pre-line;">${s.content}</p>` : '';
    
    let tableHtml = '';
    if (s.comparison_table) {
      tableHtml = `
        <div style="overflow-x: auto; margin-top: 16px;">
          <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.85rem; color: var(--text-main);">
            <thead>
              <tr style="border-bottom: 2px solid var(--accent-violet); background: rgba(121,40,202,0.12);">
                <th style="padding: 10px;">NLP Model</th>
                <th style="padding: 10px;">Architecture</th>
                <th style="padding: 10px;">Pre-training Objective</th>
                <th style="padding: 10px;">ROUGE Score</th>
                <th style="padding: 10px;">Best For</th>
              </tr>
            </thead>
            <tbody>
              ${s.comparison_table.map(row => `
                <tr style="border-bottom: 1px solid var(--border-glass);">
                  <td style="padding: 10px; font-weight: 700; color: var(--accent-violet);">${row.model}</td>
                  <td style="padding: 10px; color: var(--text-muted);">${row.architecture}</td>
                  <td style="padding: 10px; color: var(--accent-cyan); font-family: var(--font-code);">${row.objective}</td>
                  <td style="padding: 10px; font-weight: 600;">${row.summarization_score}</td>
                  <td style="padding: 10px; color: var(--text-dim);">${row.best_for}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    }

    return `
      <div style="margin-bottom: 28px;">
        <h3 style="font-size: 1.25rem; color: var(--accent-violet); margin-bottom: 10px;">${s.heading}</h3>
        ${content}
        ${tableHtml}
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div class="glass-card fade-in" style="padding: 32px; border: 1px solid rgba(121,40,202,0.4); box-shadow: 0 0 25px rgba(121,40,202,0.15);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
        <span class="section-tag" style="background: rgba(121,40,202,0.15); color: var(--accent-violet);"><i class="fas fa-brain"></i> SECTION 3: COMPLETE EDUCATIONAL GUIDE</span>
        <div style="display: flex; gap: 10px;">
          <span class="badge" style="background: rgba(121,40,202,0.2); color: var(--accent-violet); border-color: rgba(121,40,202,0.4);">${data.difficulty}</span>
          <span style="font-size: 0.85rem; color: var(--text-muted);"><i class="far fa-clock"></i> ${data.read_time}</span>
        </div>
      </div>

      <h2 style="font-size: 2.1rem; margin-bottom: 8px; color: var(--text-main);">${data.title}</h2>
      <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 24px;">${data.subtitle}</p>

      <!-- Architecture Diagram Box -->
      <div style="background: rgba(0,0,0,0.6); padding: 20px; border-radius: var(--radius-md); border: 1px solid rgba(121,40,202,0.3); margin-bottom: 30px;">
        <div style="font-size: 0.8rem; color: var(--accent-violet); font-weight: 700; text-transform: uppercase; margin-bottom: 10px;"><i class="fas fa-sitemap"></i> PEGASUS Transformer Encoder-Decoder Architecture</div>
        <pre style="margin: 0; overflow-x: auto;"><code class="language-plaintext" style="font-size: 0.85rem; color: var(--accent-violet); font-family: var(--font-code); line-height: 1.6;">${data.architecture_diagram}</code></pre>
      </div>

      ${sectionsHtml}
    </div>
  `;
}
