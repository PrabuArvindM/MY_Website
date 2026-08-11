/* ==========================================================================
   PRABU ARVIND M - JARVIS AI KNOWLEDGE HUB DASHBOARD (REAL-TIME LIVE NEWS)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initJarvisDashboard();
});

function initJarvisDashboard(refresh = false) {
  const container = document.getElementById('jarvis-hero-summary-container');
  if (refresh && container) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px; color: var(--accent-cyan);">
        <i class="fas fa-sync-alt fa-spin" style="font-size: 2rem; margin-bottom: 12px;"></i>
        <p style="font-size: 1.1rem; font-weight: 600;">Jarvis AI Scanning Real-Time Global Feeds & Research Papers...</p>
      </div>
    `;
  }

  const endpoint = refresh ? '/api/jarvis-hub/newsletter?refresh=true' : '/api/jarvis-hub/newsletter';
  fetch(endpoint)
    .then(res => res.json())
    .then(data => {
      renderHeroSummaryPanel(data);
      renderThreeFeatureCards();
      renderTopHeadlines(data.articles ? data.articles.slice(0, 5) : []);
    })
    .catch(err => {
      console.error("Error initializing Jarvis Dashboard:", err);
      if (container) {
        container.innerHTML = `<div style="color: var(--text-muted); text-align: center; padding: 20px;">Failed to load live AI news. Please try refreshing.</div>`;
      }
    });
}

function renderHeroSummaryPanel(data) {
  const container = document.getElementById('jarvis-hero-summary-container');
  if (!container) return;

  const topCompany = (data.articles && data.articles.length > 0) ? data.articles[0].company : 'AI Industry';
  const topSource = (data.articles && data.articles.length > 0) ? data.articles[0].source_name : 'Global RSS Feeds';
  const storiesCount = data.articles ? data.articles.length : 0;
  const scanTime = data.last_scan_time || 'Live Now';

  container.innerHTML = `
    <!-- Top Badge & Header -->
    <div style="text-align: center; margin-bottom: 24px;">
      <span class="badge" style="background: rgba(0, 242, 254, 0.12); color: var(--accent-cyan); border-color: var(--border-glow); font-size: 0.85rem; padding: 6px 16px; margin-bottom: 12px; display: inline-flex; align-items: center; gap: 8px;">
        <i class="fas fa-satellite-dish" style="color: #00e676; font-size: 0.8rem;"></i> Real-Time AI News Feed • Powered by Jarvis AI Agent
      </span>
      <h2 style="font-size: 2.5rem; margin-bottom: 6px; color: var(--text-main);">Jarvis AI Knowledge Hub</h2>
      <p style="color: var(--accent-cyan); font-weight: 600; font-size: 1.05rem;">Daily AI Intelligence • Learning Resources • Research Updates</p>
    </div>

    <!-- Executive Summary Box -->
    <div class="glass-card fade-in" style="padding: 24px 28px; border-radius: var(--radius-md); border: 1px solid var(--border-glow); box-shadow: var(--shadow-neon); margin-bottom: 24px; position: relative;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 10px;">
        <div style="font-size: 0.85rem; color: var(--accent-cyan); font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; display: flex; align-items: center; gap: 6px;">
          <i class="fas fa-bolt"></i> Today's Live AI Brief
        </div>
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="font-size: 0.85rem; color: var(--text-muted); font-family: var(--font-code);">
            Updated: <strong style="color: var(--accent-cyan);">${data.date} (${scanTime})</strong>
          </div>
          <button class="btn btn-outline" style="padding: 4px 12px; font-size: 0.78rem; border-color: var(--accent-cyan); color: var(--accent-cyan);" onclick="initJarvisDashboard(true)">
            <i class="fas fa-sync-alt"></i> Refresh Live AI News
          </button>
        </div>
      </div>
      
      <p style="font-size: 1.02rem; color: var(--text-main); line-height: 1.7; margin-bottom: 0;">
        "${data.daily_summary || "Today's live AI developments summarized in real-time by Jarvis AI Agent."}"
      </p>
    </div>

    <!-- Metric Cards Row -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 14px; margin-bottom: 36px;">
      <div class="glass-card" style="padding: 14px 18px; border-radius: 16px; text-align: center; border: 1px solid var(--border-glass);">
        <div style="font-size: 0.75rem; color: var(--text-dim); text-transform: uppercase; margin-bottom: 4px;">Live Date</div>
        <div style="font-size: 0.95rem; font-weight: 700; color: var(--accent-cyan); font-family: var(--font-code);">${data.date}</div>
      </div>

      <div class="glass-card" style="padding: 14px 18px; border-radius: 16px; text-align: center; border: 1px solid var(--border-glass);">
        <div style="font-size: 0.75rem; color: var(--text-dim); text-transform: uppercase; margin-bottom: 4px;">Stories Today</div>
        <div style="font-size: 1.2rem; font-weight: 700; color: var(--accent-cyan);">${storiesCount}</div>
      </div>

      <div class="glass-card" style="padding: 14px 18px; border-radius: 16px; text-align: center; border: 1px solid var(--border-glass);">
        <div style="font-size: 0.75rem; color: var(--text-dim); text-transform: uppercase; margin-bottom: 4px;">Research Feeds</div>
        <div style="font-size: 0.95rem; font-weight: 700; color: var(--accent-violet);">arXiv & HF</div>
      </div>

      <div class="glass-card" style="padding: 14px 18px; border-radius: 16px; text-align: center; border: 1px solid var(--border-glass);">
        <div style="font-size: 0.75rem; color: var(--text-dim); text-transform: uppercase; margin-bottom: 4px;">Trending Focus</div>
        <div style="font-size: 0.95rem; font-weight: 700; color: var(--text-main); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${topCompany}</div>
      </div>

      <div class="glass-card" style="padding: 14px 18px; border-radius: 16px; text-align: center; border: 1px solid var(--border-glass);">
        <div style="font-size: 0.75rem; color: var(--text-dim); text-transform: uppercase; margin-bottom: 4px;">Top Source</div>
        <div style="font-size: 0.95rem; font-weight: 700; color: var(--accent-pink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${topSource}</div>
      </div>

      <div class="glass-card" style="padding: 14px 18px; border-radius: 16px; text-align: center; border: 1px solid var(--border-glass);">
        <div style="font-size: 0.75rem; color: var(--text-dim); text-transform: uppercase; margin-bottom: 4px;">Feed Status</div>
        <div style="font-size: 0.85rem; font-weight: 700; color: var(--accent-green); display: flex; align-items: center; justify-content: center; gap: 6px;">
          <i class="fas fa-circle" style="font-size: 0.4rem; color: #00e676;"></i> Live Dynamic
        </div>
      </div>
    </div>
  `;
}

function renderThreeFeatureCards() {
  const container = document.getElementById('jarvis-feature-cards-container');
  if (!container) return;

  container.innerHTML = `
    <!-- CARD 1: Today's AI Newsletter -->
    <div class="glass-card jarvis-card-hover fade-in" style="padding: 30px; border-radius: 16px; border: 1px solid var(--border-glow); box-shadow: var(--shadow-neon); display: flex; flex-direction: column; justify-content: space-between; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);">
      <div>
        <div style="font-size: 2.8rem; margin-bottom: 14px;">📰</div>
        <h3 style="font-size: 1.6rem; margin-bottom: 4px; color: var(--text-main);">Today's AI Newsletter</h3>
        <div style="font-size: 0.88rem; font-weight: 600; color: var(--accent-cyan); margin-bottom: 12px;">Real-Time Artificial Intelligence Updates</div>
        <p style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; margin-bottom: 16px;">
          Receive a real-time dynamic summary of the latest AI developments happening around the world.
        </p>
        <div style="font-size: 0.85rem; color: var(--text-dim); margin-bottom: 20px; line-height: 1.7;">
          <strong>Live Sources:</strong><br />
          • OpenAI • Google DeepMind • Anthropic<br />
          • DeepSeek • Meta AI • NVIDIA • arXiv<br />
          • HuggingFace • Robotics • Computer Vision
        </div>
      </div>
      <button class="btn btn-primary" style="padding: 12px 20px; font-size: 0.9rem; width: 100%; border-radius: 12px;" onclick="openNewsletterModal()"><i class="fas fa-rss"></i> Read Today's Live News →</button>
    </div>

    <!-- CARD 2: OCR Learning Hub -->
    <div class="glass-card jarvis-card-hover fade-in" style="padding: 30px; border-radius: 16px; border: 1px solid var(--border-glow); box-shadow: var(--shadow-neon); display: flex; flex-direction: column; justify-content: space-between; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);">
      <div>
        <div style="font-size: 2.8rem; margin-bottom: 14px;">📖</div>
        <h3 style="font-size: 1.6rem; margin-bottom: 4px; color: var(--text-main);">OCR Learning Hub</h3>
        <div style="font-size: 0.88rem; font-weight: 600; color: var(--accent-violet); margin-bottom: 12px;">Beginner → Advanced</div>
        <p style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; margin-bottom: 16px;">
          Complete OCR learning roadmap covering:
        </p>
        <div style="font-size: 0.85rem; color: var(--text-dim); margin-bottom: 20px; line-height: 1.7;">
          • OCR Basics • PaddleOCR • EasyOCR<br />
          • Tesseract • LayoutLM • Donut<br />
          • Gemini OCR • MinerU • Document AI<br />
          • Medical OCR • Invoice OCR • Table OCR
        </div>
      </div>
      <button class="btn btn-secondary" style="padding: 12px 20px; font-size: 0.9rem; width: 100%; border-radius: 12px;" onclick="openOCRModal()">Read OCR Guide →</button>
    </div>

    <!-- CARD 3: PEGASUS AI -->
    <div class="glass-card jarvis-card-hover fade-in" style="padding: 30px; border-radius: 16px; border: 1px solid var(--border-glow); box-shadow: var(--shadow-neon); display: flex; flex-direction: column; justify-content: space-between; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);">
      <div>
        <div style="font-size: 2.8rem; margin-bottom: 14px;">🤖</div>
        <h3 style="font-size: 1.6rem; margin-bottom: 4px; color: var(--text-main);">PEGASUS AI</h3>
        <div style="font-size: 0.88rem; font-weight: 600; color: var(--accent-pink); margin-bottom: 12px;">Abstractive Text Summarization</div>
        <p style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; margin-bottom: 16px;">
          Complete guide to:
        </p>
        <div style="font-size: 0.85rem; color: var(--text-dim); margin-bottom: 20px; line-height: 1.7;">
          • Transformer • PEGASUS • Encoder Decoder<br />
          • Fine Tuning • HuggingFace • PyTorch<br />
          • BERTScore • ROUGE<br />
          • Real Project Implementation
        </div>
      </div>
      <button class="btn btn-outline" style="padding: 12px 20px; font-size: 0.9rem; width: 100%; border-radius: 12px; border-color: var(--accent-pink); color: var(--accent-pink);" onclick="openPegasusModal()">Read PEGASUS Guide →</button>
    </div>
  `;
}

function renderTopHeadlines(stories) {
  const container = document.getElementById('jarvis-top-headlines-container');
  if (!container) return;

  if (!stories || stories.length === 0) {
    container.innerHTML = `<div style="color: var(--text-muted); padding: 20px;">No top stories available. Try refreshing live news.</div>`;
    return;
  }

  container.innerHTML = stories.map((item, idx) => {
    const sourceLink = (item.source_url && item.source_url !== '#')
      ? `<a href="${item.source_url}" target="_blank" style="color: var(--accent-cyan); font-size: 0.85rem; text-decoration: none; display: inline-flex; align-items: center; gap: 4px; font-weight: 600;">
           Read Article on ${item.source_name} <i class="fas fa-external-link-alt" style="font-size: 0.75rem;"></i>
         </a>`
      : `<span style="font-size: 0.8rem; color: var(--text-dim);"><i class="fas fa-satellite-dish"></i> ${item.source_name}</span>`;

    return `
      <div class="glass-card fade-in" style="padding: 26px; border-radius: 16px; border: 1px solid var(--border-glass); margin-bottom: 20px; text-align: left; transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;">
        <!-- Header Row -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span class="chip" style="background: rgba(0, 242, 254, 0.12); color: var(--accent-cyan); font-weight: 700; font-family: var(--font-code); font-size: 0.8rem; padding: 4px 10px;">
              #${idx + 1} ${item.company}
            </span>
          </div>
          ${sourceLink}
        </div>

        <!-- Left Cyan Accent Bar + Headline -->
        <div style="border-left: 3px solid var(--accent-cyan); padding-left: 14px; margin: 14px 0 12px 0;">
          <h4 style="font-size: 1.2rem; color: var(--text-main); line-height: 1.4; margin: 0; font-weight: 700;">${item.headline}</h4>
        </div>

        <!-- Explanation Paragraph -->
        <p style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.65; margin-bottom: 16px;">${item.explanation}</p>

        <!-- Unique "Why It Matters" Callout Container -->
        <div style="background: rgba(0, 242, 254, 0.04); border-radius: 12px; padding: 14px 18px; border: 1px dashed var(--border-glow); display: flex; align-items: flex-start; gap: 12px; flex-wrap: wrap;">
          <div style="background: rgba(0, 242, 254, 0.15); color: var(--accent-cyan); padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 700; white-space: nowrap; font-family: var(--font-heading);">
            💡 WHY IT MATTERS
          </div>
          <div style="font-size: 0.9rem; color: var(--text-main); line-height: 1.5; flex: 1; min-width: 200px;">
            ${item.why_it_matters}
          </div>
        </div>
      </div>
    `;
  }).join('');
}
