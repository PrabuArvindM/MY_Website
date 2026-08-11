/* ==========================================================================
   PRABU ARVIND M - JARVIS AI KNOWLEDGE HUB (3 CARDS LAYOUT)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  renderJarvisThreeCards();
});

function renderJarvisThreeCards() {
  const container = document.getElementById('jarvis-three-cards-container');
  if (!container) return;

  container.innerHTML = `
    <!-- CARD 1: Today's AI Newsletter -->
    <div class="glass-card jarvis-card-hover fade-in" style="padding: 36px; border-radius: var(--radius-md); border: 1px solid var(--border-glow); box-shadow: var(--shadow-neon); display: flex; flex-direction: column; justify-content: space-between; transition: all 0.4s ease;">
      <div>
        <div style="width: 56px; height: 56px; border-radius: var(--radius-sm); background: rgba(0, 242, 254, 0.12); display: flex; align-items: center; justify-content: center; color: var(--accent-cyan); font-size: 1.8rem; margin-bottom: 20px;">
          <i class="fas fa-newspaper"></i>
        </div>
        <span class="section-tag" style="background: rgba(0, 242, 254, 0.15); color: var(--accent-cyan); margin-bottom: 12px;">DAILY AI NEWSLETTER</span>
        <h3 style="font-size: 1.8rem; margin-bottom: 6px; color: var(--text-main);">Today's AI Newsletter</h3>
        <div style="font-size: 0.95rem; font-weight: 600; color: var(--accent-cyan); margin-bottom: 16px;">Real-time Artificial Intelligence News</div>
        <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.7; margin-bottom: 24px;">
          Stay updated with today's most important developments in Artificial Intelligence, Generative AI, Machine Learning, Robotics, Computer Vision, AI Agents, and LLMs.
        </p>
      </div>
      <button class="btn btn-primary" style="padding: 12px 24px; font-size: 0.95rem; width: 100%;" onclick="openNewsletterModal()"><i class="fas fa-book-reader"></i> Read Today's News</button>
    </div>

    <!-- CARD 2: OCR Learning Hub -->
    <div class="glass-card jarvis-card-hover fade-in" style="padding: 36px; border-radius: var(--radius-md); border: 1px solid var(--border-glow); box-shadow: var(--shadow-neon); display: flex; flex-direction: column; justify-content: space-between; transition: all 0.4s ease;">
      <div>
        <div style="width: 56px; height: 56px; border-radius: var(--radius-sm); background: rgba(121, 40, 202, 0.15); display: flex; align-items: center; justify-content: center; color: var(--accent-violet); font-size: 1.8rem; margin-bottom: 20px;">
          <i class="fas fa-file-invoice"></i>
        </div>
        <span class="section-tag" style="background: rgba(121, 40, 202, 0.15); color: var(--accent-violet); margin-bottom: 12px;">LEARNING ROADMAP</span>
        <h3 style="font-size: 1.8rem; margin-bottom: 6px; color: var(--text-main);">OCR Learning Hub</h3>
        <div style="font-size: 0.95rem; font-weight: 600; color: var(--accent-violet); margin-bottom: 16px;">Complete OCR Learning Roadmap</div>
        <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.7; margin-bottom: 24px;">
          Everything about OCR from beginner to advanced including document AI, handwriting recognition and multimodal OCR systems.
        </p>
      </div>
      <button class="btn btn-secondary" style="padding: 12px 24px; font-size: 0.95rem; width: 100%;" onclick="openOCRModal()"><i class="fas fa-graduation-cap"></i> Read OCR Guide</button>
    </div>

    <!-- CARD 3: PEGASUS AI Guide -->
    <div class="glass-card jarvis-card-hover fade-in" style="padding: 36px; border-radius: var(--radius-md); border: 1px solid var(--border-glow); box-shadow: var(--shadow-neon); display: flex; flex-direction: column; justify-content: space-between; transition: all 0.4s ease;">
      <div>
        <div style="width: 56px; height: 56px; border-radius: var(--radius-sm); background: rgba(255, 0, 128, 0.12); display: flex; align-items: center; justify-content: center; color: var(--accent-pink); font-size: 1.8rem; margin-bottom: 20px;">
          <i class="fas fa-brain"></i>
        </div>
        <span class="section-tag" style="background: rgba(255, 0, 128, 0.15); color: var(--accent-pink); margin-bottom: 12px;">NLP RESEARCH GUIDE</span>
        <h3 style="font-size: 1.8rem; margin-bottom: 6px; color: var(--text-main);">PEGASUS AI Guide</h3>
        <div style="font-size: 0.95rem; font-weight: 600; color: var(--accent-pink); margin-bottom: 16px;">Transformer based Text Summarization</div>
        <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.7; margin-bottom: 24px;">
          Learn how PEGASUS works for abstractive summarization with practical implementation details and research insights.
        </p>
      </div>
      <button class="btn btn-outline" style="padding: 12px 24px; font-size: 0.95rem; width: 100%; border-color: var(--accent-pink); color: var(--accent-pink);" onclick="openPegasusModal()"><i class="fas fa-code-branch"></i> Read PEGASUS Guide</button>
    </div>
  `;
}

// 1. CARD 1 DEDICATED READER MODAL
function openNewsletterModal(refresh = false) {
  const modal = document.getElementById('blog-modal');
  const content = document.getElementById('blog-modal-body');
  if (!modal || !content) return;

  if (refresh) {
    content.innerHTML = `
      <div style="text-align: center; padding: 40px; color: var(--accent-cyan);">
        <i class="fas fa-sync-alt fa-spin" style="font-size: 2rem; margin-bottom: 12px;"></i>
        <p style="font-size: 1.1rem; font-weight: 600;">Jarvis AI Scanning Live RSS Feeds...</p>
      </div>
    `;
    modal.classList.add('active');
  }

  const endpoint = refresh ? '/api/jarvis-hub/newsletter?refresh=true' : '/api/jarvis-hub/newsletter';

  fetch(endpoint)
    .then(res => res.json())
    .then(data => {
      const articlesHtml = (data.articles || []).map(art => {
        const sourceButton = (art.source_url && art.source_url !== '#')
          ? `<a href="${art.source_url}" target="_blank" class="btn btn-outline" style="font-size: 0.8rem; padding: 6px 14px; border-color: var(--accent-cyan); color: var(--accent-cyan); text-decoration: none; margin-top: 12px; display: inline-flex; align-items: center; gap: 6px;">
               Read Original Story on ${art.source_name || 'Source'} <i class="fas fa-external-link-alt"></i>
             </a>`
          : '';

        return `
          <div style="background: rgba(255,255,255,0.02); padding: 24px; border-radius: var(--radius-md); border: 1px solid var(--border-glass); margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; margin-bottom: 6px;">
              <span style="font-size: 0.8rem; font-weight: 700; color: var(--accent-cyan); text-transform: uppercase;">${art.company}</span>
              <span style="font-size: 0.8rem; color: var(--text-dim);"><i class="fas fa-satellite-dish"></i> ${art.source_name || 'Live Source'}</span>
            </div>
            <h3 style="font-size: 1.3rem; margin-bottom: 10px; color: var(--text-main); line-height: 1.4;">${art.headline}</h3>
            <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 14px;">${art.explanation}</p>
            <div style="background: rgba(0, 242, 254, 0.04); padding: 12px 16px; border-radius: var(--radius-sm); border-left: 3px solid var(--accent-cyan); margin-bottom: 12px; font-size: 0.9rem; color: var(--text-main);">
              <strong>Why it matters:</strong> ${art.why_it_matters}
            </div>
            ${sourceButton}
          </div>
        `;
      }).join('');

      content.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 10px;">
          <div>
            <span class="section-tag"><i class="fas fa-newspaper"></i> REAL-TIME AI EDITION</span>
            <h1 style="font-size: 2.2rem; margin-top: 8px; color: var(--text-main);">${data.title}</h1>
            <div style="color: var(--accent-cyan); font-weight: 600; font-size: 0.95rem; font-family: var(--font-code);">
              Updated: ${data.date} (${data.last_scan_time || 'Live Feed'})
            </div>
          </div>
          <button class="btn btn-outline" style="padding: 6px 14px; font-size: 0.85rem; border-color: var(--accent-cyan); color: var(--accent-cyan);" onclick="openNewsletterModal(true)">
            <i class="fas fa-sync-alt"></i> Refresh Live Feeds
          </button>
        </div>

        <div style="background: rgba(0, 242, 254, 0.08); padding: 20px; border-radius: var(--radius-md); border: 1px dashed var(--border-glow); margin-bottom: 30px;">
          <div style="font-size: 0.82rem; color: var(--accent-cyan); font-weight: 700; text-transform: uppercase; margin-bottom: 6px;">🤖 Jarvis Daily Industry Executive Brief</div>
          <p style="font-size: 0.98rem; color: var(--text-main); line-height: 1.7; margin: 0;">${data.daily_summary}</p>
        </div>

        <h3 style="font-size: 1.5rem; margin-bottom: 20px; color: var(--accent-cyan);"><i class="fas fa-rss"></i> Today's Live AI News Articles</h3>
        ${articlesHtml}

        <div style="display: flex; gap: 12px; margin-top: 20px;">
          <button class="btn btn-primary" onclick="closeBlogModal()">Close Newsletter</button>
          <button class="btn btn-outline" style="border-color: var(--accent-cyan); color: var(--accent-cyan);" onclick="openNewsletterModal(true)"><i class="fas fa-sync-alt"></i> Refresh Feeds</button>
        </div>
      `;

      modal.classList.add('active');
    })
    .catch(err => console.error("Error loading newsletter modal:", err));
}

// 2. CARD 2 DEDICATED READER MODAL
function openOCRModal() {
  fetch('/api/jarvis-hub/ocr-roadmap')
    .then(res => res.json())
    .then(data => {
      const modal = document.getElementById('blog-modal');
      const content = document.getElementById('blog-modal-body');
      if (!modal || !content) return;

      let domainsHtml = data.domain_types.map(d => `
        <div style="background: rgba(255,255,255,0.02); padding: 14px 18px; border-radius: var(--radius-sm); border: 1px solid var(--border-glass);">
          <strong style="color: var(--accent-violet); font-size: 0.95rem;">${d.domain}:</strong>
          <span style="color: var(--text-muted); font-size: 0.9rem; margin-left: 6px;">${d.description}</span>
        </div>
      `).join('');

      let historyHtml = data.history_and_evolution.map(h => `<li style="margin-bottom: 8px;">${h}</li>`).join('');

      let tableHtml = `
        <div style="overflow-x: auto; margin: 20px 0;">
          <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.85rem; color: var(--text-main);">
            <thead>
              <tr style="border-bottom: 2px solid var(--accent-violet); background: rgba(121, 40, 202, 0.15);">
                <th style="padding: 12px;">OCR Engine</th>
                <th style="padding: 12px;">Architecture / Model</th>
                <th style="padding: 12px;">Inference Speed</th>
                <th style="padding: 12px;">Accuracy</th>
                <th style="padding: 12px;">Best For</th>
              </tr>
            </thead>
            <tbody>
              ${data.comparison_table.map(row => `
                <tr style="border-bottom: 1px solid var(--border-glass);">
                  <td style="padding: 12px; font-weight: 700; color: var(--accent-violet);">${row.engine}</td>
                  <td style="padding: 12px; color: var(--text-muted);">${row.paradigm}</td>
                  <td style="padding: 12px; color: var(--accent-green); font-family: var(--font-code);">${row.speed}</td>
                  <td style="padding: 12px; font-weight: 600;">${row.accuracy}</td>
                  <td style="padding: 12px; color: var(--text-dim);">${row.best_for}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;

      content.innerHTML = `
        <div style="margin-bottom: 20px; display: flex; gap: 10px; align-items: center;">
          <span class="section-tag" style="background: rgba(121, 40, 202, 0.15); color: var(--accent-violet);"><i class="fas fa-file-invoice"></i> OCR LEARNING HUB</span>
          <span class="badge" style="background: rgba(121, 40, 202, 0.2); color: var(--accent-violet);">${data.difficulty}</span>
          <span style="font-size: 0.85rem; color: var(--text-muted);"><i class="far fa-clock"></i> ${data.read_time}</span>
        </div>

        <h1 style="font-size: 2.3rem; margin-bottom: 8px; color: var(--text-main);">${data.title}</h1>
        <p style="color: var(--text-muted); font-size: 1rem; margin-bottom: 24px;">${data.subtitle}</p>

        <!-- Pipeline Diagram -->
        <div style="background: rgba(0,0,0,0.6); padding: 20px; border-radius: var(--radius-md); border: 1px solid var(--accent-violet); margin-bottom: 30px;">
          <div style="font-size: 0.82rem; color: var(--accent-violet); font-weight: 700; text-transform: uppercase; margin-bottom: 10px;"><i class="fas fa-project-diagram"></i> OCR 4-Stage Production Architecture Pipeline</div>
          <pre style="margin: 0; overflow-x: auto;"><code class="language-plaintext" style="font-size: 0.85rem; color: var(--accent-violet); font-family: var(--font-code); line-height: 1.6;">${data.pipeline_diagram}</code></pre>
        </div>

        <h3 style="color: var(--accent-violet); font-size: 1.3rem; margin-bottom: 12px;">1. What is OCR & History</h3>
        <p style="color: var(--text-muted); line-height: 1.8; margin-bottom: 16px;">${data.overview}</p>
        <ul style="list-style: none; padding-left: 0; color: var(--text-muted); line-height: 1.7; margin-bottom: 24px;">${historyHtml}</ul>

        <h3 style="color: var(--accent-violet); font-size: 1.3rem; margin-bottom: 12px;">2. OCR Domains & Specialized Systems</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 12px; margin-bottom: 30px;">${domainsHtml}</div>

        <h3 style="color: var(--accent-violet); font-size: 1.3rem; margin-bottom: 12px;">3. Comprehensive OCR Engines & LLM Comparison Matrix</h3>
        ${tableHtml}

        <h3 style="color: var(--accent-violet); font-size: 1.3rem; margin-bottom: 12px;">4. Production Python Code Example</h3>
        <pre style="background: rgba(0,0,0,0.6); padding: 20px; border-radius: var(--radius-sm); border: 1px solid var(--border-glass); overflow-x: auto; margin-bottom: 24px;"><code class="language-python" style="color: var(--accent-cyan);">${data.code_example}</code></pre>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;">
          <div style="background: rgba(0,242,254,0.03); padding: 18px; border-radius: var(--radius-sm); border: 1px solid var(--border-glass);">
            <h4 style="color: var(--accent-cyan); margin-bottom: 8px;">Key Advantages</h4>
            <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.6; whitespace-line: pre-line;">${data.advantages}</p>
          </div>
          <div style="background: rgba(255,0,128,0.03); padding: 18px; border-radius: var(--radius-sm); border: 1px solid var(--border-glass);">
            <h4 style="color: var(--accent-pink); margin-bottom: 8px;">Engineering Limitations</h4>
            <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.6; whitespace-line: pre-line;">${data.limitations}</p>
          </div>
        </div>

        <button class="btn btn-primary" onclick="closeBlogModal()">Close OCR Guide</button>
      `;

      modal.classList.add('active');
    })
    .catch(err => console.error("Error loading OCR modal:", err));
}

// 3. CARD 3 DEDICATED READER MODAL
function openPegasusModal() {
  fetch('/api/jarvis-hub/pegasus-roadmap')
    .then(res => res.json())
    .then(data => {
      const modal = document.getElementById('blog-modal');
      const content = document.getElementById('blog-modal-body');
      if (!modal || !content) return;

      const proj = data.my_project_implementation;

      let extVsAbsHtml = data.extractive_vs_abstractive.map(item => `
        <div style="background: rgba(255,255,255,0.02); padding: 16px; border-radius: var(--radius-sm); border: 1px solid var(--border-glass); margin-bottom: 12px;">
          <h4 style="color: var(--accent-pink); margin-bottom: 6px;">${item.type}</h4>
          <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 8px;">${item.mechanism}</p>
          <div style="font-size: 0.85rem; color: var(--accent-green);"><strong>Pros:</strong> ${item.pros}</div>
        </div>
      `).join('');

      let metricsHtml = data.evaluation_metrics.map(m => `
        <div style="background: rgba(255,255,255,0.02); padding: 12px 16px; border-radius: var(--radius-sm); border: 1px solid var(--border-glass);">
          <strong style="color: var(--accent-cyan); font-size: 0.95rem;">${m.metric}:</strong>
          <span style="color: var(--text-muted); font-size: 0.9rem; margin-left: 6px;">${m.description}</span>
        </div>
      `).join('');

      let tableHtml = `
        <div style="overflow-x: auto; margin: 20px 0;">
          <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.85rem; color: var(--text-main);">
            <thead>
              <tr style="border-bottom: 2px solid var(--accent-pink); background: rgba(255, 0, 128, 0.12);">
                <th style="padding: 12px;">NLP Model</th>
                <th style="padding: 12px;">Architecture</th>
                <th style="padding: 12px;">Pretraining Objective</th>
                <th style="padding: 12px;">ROUGE Score</th>
                <th style="padding: 12px;">Best For</th>
              </tr>
            </thead>
            <tbody>
              ${data.model_comparison.map(row => `
                <tr style="border-bottom: 1px solid var(--border-glass);">
                  <td style="padding: 12px; font-weight: 700; color: var(--accent-pink);">${row.model}</td>
                  <td style="padding: 12px; color: var(--text-muted);">${row.architecture}</td>
                  <td style="padding: 12px; color: var(--accent-cyan); font-family: var(--font-code);">${row.objective}</td>
                  <td style="padding: 12px; font-weight: 600;">${row.rouge_score}</td>
                  <td style="padding: 12px; color: var(--text-dim);">${row.best_for}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;

      content.innerHTML = `
        <div style="margin-bottom: 20px; display: flex; gap: 10px; align-items: center;">
          <span class="section-tag" style="background: rgba(255, 0, 128, 0.15); color: var(--accent-pink);"><i class="fas fa-brain"></i> PEGASUS RESEARCH GUIDE</span>
          <span class="badge" style="background: rgba(255, 0, 128, 0.2); color: var(--accent-pink);">${data.difficulty}</span>
          <span style="font-size: 0.85rem; color: var(--text-muted);"><i class="far fa-clock"></i> ${data.read_time}</span>
        </div>

        <h1 style="font-size: 2.3rem; margin-bottom: 8px; color: var(--text-main);">${data.title}</h1>
        <p style="color: var(--text-muted); font-size: 1rem; margin-bottom: 24px;">${data.subtitle}</p>

        <!-- Architecture Diagram -->
        <div style="background: rgba(0,0,0,0.6); padding: 20px; border-radius: var(--radius-md); border: 1px solid var(--accent-pink); margin-bottom: 30px;">
          <div style="font-size: 0.82rem; color: var(--accent-pink); font-weight: 700; text-transform: uppercase; margin-bottom: 10px;"><i class="fas fa-sitemap"></i> PEGASUS Transformer Encoder-Decoder Architecture</div>
          <pre style="margin: 0; overflow-x: auto;"><code class="language-plaintext" style="font-size: 0.85rem; color: var(--accent-pink); font-family: var(--font-code); line-height: 1.6;">${data.architecture_diagram}</code></pre>
        </div>

        <h3 style="color: var(--accent-pink); font-size: 1.3rem; margin-bottom: 12px;">1. Overview & Gap Sentence Generation (GSG)</h3>
        <p style="color: var(--text-muted); line-height: 1.8; margin-bottom: 24px;">${data.overview}</p>

        <h3 style="color: var(--accent-pink); font-size: 1.3rem; margin-bottom: 12px;">2. Extractive vs. Abstractive Summarization</h3>
        ${extVsAbsHtml}

        <h3 style="color: var(--accent-pink); font-size: 1.3rem; margin-bottom: 12px;">3. Evaluation Metrics (ROUGE, BERTScore, BLEU)</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 12px; margin-bottom: 30px;">${metricsHtml}</div>

        <h3 style="color: var(--accent-pink); font-size: 1.3rem; margin-bottom: 12px;">4. Model Comparison Table</h3>
        ${tableHtml}

        <!-- MY PROJECT IMPLEMENTATION SECTION -->
        <div style="background: rgba(0, 242, 254, 0.03); padding: 28px; border-radius: var(--radius-md); border: 1px dashed var(--border-glow); margin-bottom: 30px;">
          <span class="section-tag" style="margin-bottom: 12px;"><i class="fas fa-laptop-code"></i> PRABU'S REAL-WORLD PROJECT IMPLEMENTATION</span>
          <h3 style="font-size: 1.5rem; margin-bottom: 8px; color: var(--text-main);">${proj.title}</h3>
          <p style="color: var(--accent-cyan); font-size: 0.95rem; margin-bottom: 16px;"><strong>Tech Stack:</strong> ${proj.tech_stack}</p>

          <div style="background: rgba(0,0,0,0.6); padding: 18px; border-radius: var(--radius-sm); border: 1px solid var(--border-glass); margin-bottom: 20px;">
            <div style="font-size: 0.8rem; color: var(--accent-cyan); font-weight: 700; margin-bottom: 8px;">Document Processing & Summarization Flow:</div>
            <pre style="margin: 0; overflow-x: auto;"><code class="language-plaintext" style="font-size: 0.85rem; color: var(--accent-cyan); font-family: var(--font-code); line-height: 1.6;">${proj.document_flow_diagram}</code></pre>
          </div>

          <div style="font-size: 0.85rem; color: var(--accent-cyan); font-weight: 700; margin-bottom: 8px;">PyTorch Inference Code:</div>
          <pre style="background: rgba(0,0,0,0.6); padding: 18px; border-radius: var(--radius-sm); border: 1px solid var(--border-glass); overflow-x: auto; margin-bottom: 16px;"><code class="language-python" style="color: var(--accent-cyan);">${proj.code_snippet}</code></pre>
          <div style="font-size: 0.88rem; color: var(--text-muted);"><strong>Deployment Architecture:</strong> ${proj.deployment_architecture}</div>
        </div>

        <button class="btn btn-primary" onclick="closeBlogModal()">Close PEGASUS Guide</button>
      `;

      modal.classList.add('active');
    })
    .catch(err => console.error("Error loading PEGASUS modal:", err));
}

function closeBlogModal() {
  const modal = document.getElementById('blog-modal');
  if (modal) {
    modal.classList.remove('active');
  }
}

// Global Modal Keyboard & Backdrop Click Handler
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeBlogModal();
    if (typeof closeProjectModal === 'function') closeProjectModal();
    if (typeof closeCertModal === 'function') closeCertModal();
  }
});
