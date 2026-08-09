/* ==========================================================================
   PRABU ARVIND M - PROJECTS & DETAILED WORKFLOW MODAL
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  fetchProjects();
});

let allProjects = [];

const PROJECT_CHIPS = {
  "pymorph-ai": ["LLM", "REST API", "FastAPI", "Monaco Editor", "AST Transpiler", "Authentication"],
  "news-article-summarizer": ["OCR", "LLM", "PEGASUS Transformer", "PaddleOCR", "PDF Processing", "PyTorch"],
  "cancer-prediction-app": ["CNN", "Computer Vision", "ResNet-34", "PyTorch", "OpenCV", "Clinical AI"],
  "traffic-emergency-passage": ["YOLO", "Computer Vision", "IoT", "Arduino", "ESP32", "FastAPI"]
};

function fetchProjects() {
  fetch('/api/projects')
    .then(res => res.json())
    .then(data => {
      allProjects = data;
      renderProjects('all');
      initProjectFilters();
    })
    .catch(err => console.error("Error fetching projects:", err));
}

function renderProjects(filterCategory = 'all') {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  const filtered = filterCategory === 'all' 
    ? allProjects 
    : allProjects.filter(p => p.category.toLowerCase().includes(filterCategory.toLowerCase()));

  grid.innerHTML = filtered.map(p => {
    const chips = (PROJECT_CHIPS[p.slug] || ["AI", "REST API"]).map(c => `<span class="chip">${c}</span>`).join('');
    const techList = p.tech_stack.split(',').map(t => `<span class="badge">${t.trim()}</span>`).join('');
    
    // Live Demo Button ONLY for AI Code Converter (PyMorph AI)
    const isPyMorph = p.slug === 'pymorph-ai';
    const liveDemoBtn = isPyMorph ? `<a href="https://ai-code-converter-bzwo.onrender.com" target="_blank" class="btn btn-secondary" style="padding: 10px 14px; font-size: 0.85rem;"><i class="fas fa-rocket"></i> 🚀 Live Demo</a>` : '';

    return `
      <div class="glass-card project-card fade-in">
        <div class="project-img-wrapper">
          <img src="${p.image_url}" alt="${p.title}" class="project-img" onerror="this.src='/static/assets/images/project_summarizer.jpg'" />
          <div class="project-chips-container">${chips}</div>
        </div>
        <div class="section-tag" style="align-self: flex-start; font-size: 0.75rem; margin-bottom: 8px;">${p.category}</div>
        <h3 class="project-title">${p.title}</h3>
        <p class="project-summary">${p.summary}</p>
        <div class="tech-badges">${techList}</div>
        <div style="display: flex; gap: 10px; margin-top: auto; flex-wrap: wrap;">
          <button class="btn btn-primary" onclick="openProjectModal('${p.slug}')" style="flex: 1; padding: 10px 14px; font-size: 0.85rem;">Read More <i class="fas fa-arrow-right"></i></button>
          ${liveDemoBtn}
          ${p.github_url ? `<a href="${p.github_url}" target="_blank" class="btn btn-outline" style="padding: 10px 14px;"><i class="fab fa-github"></i></a>` : ''}
        </div>
      </div>
    `;
  }).join('');
}

function initProjectFilters() {
  const buttons = document.querySelectorAll('.project-filter-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-cat');
      renderProjects(cat);
    });
  });
}

function openProjectModal(slug) {
  const p = allProjects.find(item => item.slug === slug);
  if (!p) return;

  const modal = document.getElementById('project-modal');
  const content = document.getElementById('project-modal-body');
  if (!modal || !content) return;

  const chips = (PROJECT_CHIPS[p.slug] || ["AI", "REST API"]).map(c => `<span class="chip" style="font-size: 0.8rem; padding: 4px 10px;">${c}</span>`).join('');
  const techList = p.tech_stack.split(',').map(t => `<span class="badge" style="font-size: 0.85rem; padding: 6px 14px;">${t.trim()}</span>`).join('');
  const isPyMorph = p.slug === 'pymorph-ai';
  const liveDemoBtn = isPyMorph ? `<a href="https://ai-code-converter-bzwo.onrender.com" target="_blank" class="btn btn-secondary"><i class="fas fa-rocket"></i> 🚀 Live Demo</a>` : '';

  content.innerHTML = `
    <div style="position: relative; margin-bottom: 24px;">
      <img src="${p.image_url}" style="width: 100%; height: 300px; object-fit: cover; border-radius: var(--radius-md);" onerror="this.src='/static/assets/images/project_summarizer.jpg'" />
    </div>

    <div style="display: flex; gap: 8px; margin-bottom: 12px; flex-wrap: wrap;">
      <span class="section-tag">${p.category}</span>
      ${chips}
    </div>

    <h1 style="font-size: 2.2rem; margin-bottom: 16px;">${p.title}</h1>
    <p style="font-size: 1.05rem; color: var(--text-muted); margin-bottom: 28px; line-height: 1.7;">${p.description}</p>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px;">
      <div style="background: rgba(255,255,255,0.03); padding: 20px; border-radius: var(--radius-md); border: 1px solid var(--border-glass);">
        <h4 style="color: var(--accent-cyan); margin-bottom: 10px;"><i class="fas fa-exclamation-triangle"></i> Problem Statement</h4>
        <p style="font-size: 0.95rem; color: var(--text-muted);">${p.problem_statement || 'N/A'}</p>
      </div>

      <div style="background: rgba(255,255,255,0.03); padding: 20px; border-radius: var(--radius-md); border: 1px solid var(--border-glass);">
        <h4 style="color: var(--accent-cyan); margin-bottom: 10px;"><i class="fas fa-bullseye"></i> Key Objectives</h4>
        <p style="font-size: 0.95rem; color: var(--text-muted); whitespace-line: pre-line;">${p.objectives ? p.objectives.replace(/\n/g, '<br>') : 'N/A'}</p>
      </div>
    </div>

    <div style="background: rgba(0, 242, 254, 0.04); border: 1px dashed var(--border-glow); padding: 24px; border-radius: var(--radius-md); margin-bottom: 32px;">
      <h4 style="color: var(--accent-cyan); margin-bottom: 12px;"><i class="fas fa-project-diagram"></i> Architecture & Workflow Diagram</h4>
      <p style="font-family: var(--font-code); font-size: 0.9rem; color: var(--text-main); line-height: 1.6;">${p.architecture_workflow || 'N/A'}</p>
    </div>

    <div style="margin-bottom: 32px;">
      <h4 style="margin-bottom: 12px;"><i class="fas fa-microchip"></i> Technology Stack & Algorithms</h4>
      <div class="tech-badges" style="margin-bottom: 16px;">${techList}</div>
      <p style="font-size: 0.95rem; color: var(--text-muted);"><strong>Algorithms Used:</strong> ${p.algorithms || 'Deep Learning & Transfer Learning'}</p>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px;">
      <div style="background: rgba(255,255,255,0.03); padding: 20px; border-radius: var(--radius-md); border: 1px solid var(--border-glass);">
        <h4 style="color: #ff0080; margin-bottom: 10px;"><i class="fas fa-bolt"></i> Challenges Faced</h4>
        <p style="font-size: 0.95rem; color: var(--text-muted);">${p.challenges || 'N/A'}</p>
      </div>

      <div style="background: rgba(255,255,255,0.03); padding: 20px; border-radius: var(--radius-md); border: 1px solid var(--border-glass);">
        <h4 style="color: var(--accent-green); margin-bottom: 10px;"><i class="fas fa-check-circle"></i> Solutions Implemented</h4>
        <p style="font-size: 0.95rem; color: var(--text-muted);">${p.solutions || 'N/A'}</p>
      </div>
    </div>

    <div style="display: flex; gap: 16px; flex-wrap: wrap;">
      ${p.github_url ? `<a href="${p.github_url}" target="_blank" class="btn btn-primary"><i class="fab fa-github"></i> View GitHub Repository</a>` : ''}
      ${liveDemoBtn}
    </div>
  `;

  modal.classList.add('active');
}

function closeProjectModal() {
  const modal = document.getElementById('project-modal');
  if (modal) modal.classList.remove('active');
}
