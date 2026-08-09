/* ==========================================================================
   PRABU ARVIND M - REAL GITHUB REPOSITORIES & METRICS INTEGRATION
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  fetchGitHubRepos();
});

function fetchGitHubRepos() {
  fetch('/api/github')
    .then(res => res.json())
    .then(repos => renderGitHubRepos(repos))
    .catch(err => console.error("Error fetching GitHub repos:", err));
}

function renderGitHubRepos(repos) {
  const container = document.getElementById('github-grid');
  if (!container) return;

  container.innerHTML = repos.map(r => {
    const topics = r.topics.map(t => `<span class="chip" style="font-size: 0.7rem; padding: 2px 8px;">${t}</span>`).join('');
    return `
      <div class="glass-card fade-in" style="display: flex; flex-direction: column; cursor: pointer;" onclick="window.open('${r.url}', '_blank')">
        <div class="repo-card-header">
          <a href="${r.url}" target="_blank" class="repo-name" onclick="event.stopPropagation();"><i class="fab fa-github"></i> ${r.name}</a>
          <span class="badge" style="background: rgba(121,40,202,0.15); border-color: rgba(121,40,202,0.3); color: var(--accent-violet);">${r.language}</span>
        </div>
        <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 16px; flex-grow: 1;">${r.description}</p>
        <div class="tech-badges" style="margin-bottom: 16px;">${topics}</div>
        <div class="repo-stats">
          <span><i class="far fa-star"></i> ${r.stars} Stars</span>
          <span><i class="fas fa-code-branch"></i> ${r.forks} Forks</span>
          <span style="margin-left: auto; color: var(--accent-cyan);"><i class="fas fa-external-link-alt"></i> View Code</span>
        </div>
      </div>
    `;
  }).join('');
}
