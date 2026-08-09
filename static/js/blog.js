/* ==========================================================================
   PRABU ARVIND M - AI KNOWLEDGE HUB & BLOG ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  fetchBlogs();
  initBlogControls();
});

let currentCategory = 'all';
let allBlogData = [];

function fetchBlogs(searchQuery = '') {
  let url = '/api/blogs';
  const params = new URLSearchParams();
  if (currentCategory && currentCategory !== 'all') {
    params.append('category', currentCategory);
  }
  if (searchQuery) {
    params.append('search', searchQuery);
  }
  if (params.toString()) {
    url += `?${params.toString()}`;
  }

  fetch(url)
    .then(res => res.json())
    .then(data => {
      allBlogData = data;
      renderFeaturedArticle(data);
      renderBlogGrid(data);
    })
    .catch(err => console.error("Error fetching blogs:", err));
}

function renderFeaturedArticle(blogs) {
  const container = document.getElementById('featured-article-container');
  if (!container || blogs.length === 0) return;

  const feat = blogs[0]; // Featured Top Article
  const diffColor = feat.difficulty === 'Beginner' ? '#00f2fe' : (feat.difficulty === 'Advanced' ? '#ff0080' : '#7928ca');

  container.innerHTML = `
    <div class="glass-card fade-in" style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 30px; padding: 28px; cursor: pointer; border: 1px solid var(--border-glow);" onclick="openBlogReader('${feat.slug}')">
      <div style="position: relative; overflow: hidden; border-radius: var(--radius-md); max-height: 320px;">
        <img src="${feat.banner_image}" alt="${feat.title}" style="width: 100%; height: 100%; object-fit: cover; border-radius: var(--radius-md); transition: transform 0.5s ease;" onerror="this.src='/static/assets/images/project_summarizer.jpg'" />
        <span class="chip" style="position: absolute; top: 16px; left: 16px; background: rgba(7, 9, 19, 0.85); border-color: var(--accent-cyan); font-weight: 700;">🌟 FEATURED RESEARCH GUIDE</span>
      </div>

      <div style="display: flex; flex-direction: column; justify-content: center;">
        <div style="display: flex; gap: 10px; margin-bottom: 12px; flex-wrap: wrap; align-items: center;">
          <span class="section-tag" style="font-size: 0.75rem;">${feat.category}</span>
          <span class="badge" style="font-size: 0.75rem; border-color: ${diffColor}; color: ${diffColor};">${feat.difficulty || 'Intermediate'}</span>
          <span style="font-size: 0.8rem; color: var(--text-muted);"><i class="far fa-clock"></i> ${feat.read_time}</span>
          <span style="font-size: 0.8rem; color: var(--text-muted);"><i class="fas fa-eye"></i> ${feat.views} views</span>
        </div>

        <h2 style="font-size: 1.8rem; margin-bottom: 14px; line-height: 1.3; color: var(--text-main);">${feat.title}</h2>
        <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 20px; line-height: 1.7; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">${feat.summary}</p>
        
        <div style="display: flex; align-items: center; justify-content: space-between; margin-top: auto;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <img src="/static/assets/images/prabu_profile.png" style="width: 36px; height: 36px; border-radius: 50%; border: 2px solid var(--accent-cyan);" />
            <div>
              <div style="font-size: 0.85rem; font-weight: 600; color: var(--text-main);">${feat.author || 'Prabu Arvind M'}</div>
              <div style="font-size: 0.75rem; color: var(--text-dim);">AI Engineer & Author</div>
            </div>
          </div>
          <button class="btn btn-primary" style="padding: 10px 20px; font-size: 0.85rem;">Read Full Guide <i class="fas fa-arrow-right"></i></button>
        </div>
      </div>
    </div>
  `;
}

function renderBlogGrid(blogs) {
  const container = document.getElementById('blog-grid-container');
  if (!container) return;

  if (blogs.length === 0) {
    container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px;">No technical articles found matching your criteria.</div>`;
    return;
  }

  // Skip the first article if rendered in featured section
  const displayBlogs = blogs.length > 1 ? blogs.slice(1) : blogs;

  container.innerHTML = displayBlogs.map(blog => {
    const diffColor = blog.difficulty === 'Beginner' ? '#00f2fe' : (blog.difficulty === 'Advanced' ? '#ff0080' : '#7928ca');
    const badges = (blog.tech_badges || 'AI, Python').split(',').map(b => `<span class="chip" style="font-size: 0.7rem; padding: 2px 8px;">${b.trim()}</span>`).join(' ');

    return `
      <div class="glass-card blog-card fade-in" style="display: flex; flex-direction: column; cursor: pointer;" onclick="openBlogReader('${blog.slug}')">
        <div style="position: relative; height: 180px; overflow: hidden; border-radius: var(--radius-md) var(--radius-md) 0 0; margin: -24px -24px 16px -24px;">
          <img src="${blog.banner_image}" alt="${blog.title}" class="blog-banner" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='/static/assets/images/project_summarizer.jpg'" />
          <span class="badge" style="position: absolute; top: 12px; right: 12px; background: rgba(7, 9, 19, 0.85); font-size: 0.7rem; border-color: ${diffColor}; color: ${diffColor};">${blog.difficulty || 'Intermediate'}</span>
        </div>

        <div style="display: flex; gap: 8px; align-items: center; font-size: 0.8rem; color: var(--accent-cyan); margin-bottom: 8px; flex-wrap: wrap;">
          <span><i class="far fa-folder"></i> ${blog.category}</span>
          <span>•</span>
          <span><i class="far fa-clock"></i> ${blog.read_time}</span>
        </div>

        <h3 style="font-size: 1.2rem; margin-bottom: 10px; line-height: 1.4; color: var(--text-main);">${blog.title}</h3>
        <p style="color: var(--text-muted); font-size: 0.88rem; margin-bottom: 16px; line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">${blog.summary}</p>
        
        <div style="margin-bottom: 16px; display: flex; gap: 6px; flex-wrap: wrap;">${badges}</div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: auto; padding-top: 12px; border-top: 1px dashed var(--border-glass);">
          <span style="font-size: 0.78rem; color: var(--text-dim);"><i class="fas fa-eye"></i> ${blog.views} views</span>
          <span style="font-size: 0.82rem; color: var(--accent-cyan); font-weight: 600;">Read Guide <i class="fas fa-chevron-right"></i></span>
        </div>
      </div>
    `;
  }).join('');
}

function initBlogControls() {
  const searchInput = document.getElementById('blog-search');
  if (searchInput) {
    let timeout = null;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fetchBlogs(e.target.value), 300);
    });
  }

  const categoryPills = document.querySelectorAll('.blog-cat-pill');
  categoryPills.forEach(pill => {
    pill.addEventListener('click', () => {
      categoryPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentCategory = pill.getAttribute('data-cat');
      fetchBlogs(searchInput ? searchInput.value : '');
    });
  });
}

function openBlogReader(slug) {
  fetch(`/api/blogs/${slug}`)
    .then(res => res.json())
    .then(blog => {
      const modal = document.getElementById('blog-modal');
      const content = document.getElementById('blog-modal-body');
      if (!modal || !content) return;

      // Simple Markdown to HTML Formatter
      let htmlContent = blog.content
        .replace(/^# (.*$)/gim, '<h1 id="toc-header-1" style="font-size: 2rem; margin: 28px 0 16px 0; color: var(--text-main);">$1</h1>')
        .replace(/^## (.*$)/gim, '<h2 id="toc-header-2" style="font-size: 1.5rem; margin: 24px 0 12px 0; color: var(--accent-cyan);">$1</h2>')
        .replace(/^### (.*$)/gim, '<h3 style="font-size: 1.2rem; margin: 18px 0 8px 0; color: var(--accent-violet);">$1</h3>')
        .replace(/```python([\s\S]*?)```/g, '<pre style="background: rgba(0,0,0,0.5); padding: 18px; border-radius: var(--radius-sm); border: 1px solid var(--border-glass); overflow-x: auto;"><code class="language-python" style="color: var(--accent-cyan);">$1</code></pre>')
        .replace(/```([\s\S]*?)```/g, '<pre style="background: rgba(0,0,0,0.5); padding: 18px; border-radius: var(--radius-sm); border: 1px solid var(--border-glass); overflow-x: auto;"><code>$1</code></pre>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n\n/g, '<br><br>');

      const diffColor = blog.difficulty === 'Beginner' ? '#00f2fe' : (blog.difficulty === 'Advanced' ? '#ff0080' : '#7928ca');

      content.innerHTML = `
        <div style="position: relative; margin-bottom: 24px;">
          <img src="${blog.banner_image}" style="width: 100%; height: 320px; object-fit: cover; border-radius: var(--radius-md);" onerror="this.src='/static/assets/images/project_summarizer.jpg'" />
          <div style="position: absolute; bottom: 16px; left: 16px; display: flex; gap: 8px;">
            <span class="section-tag">${blog.category}</span>
            <span class="badge" style="background: rgba(7,9,19,0.85); border-color: ${diffColor}; color: ${diffColor};">${blog.difficulty || 'Intermediate'}</span>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.88rem; color: var(--text-muted); margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
          <div style="display: flex; gap: 16px;">
            <span><i class="far fa-user" style="color: var(--accent-cyan);"></i> ${blog.author || 'Prabu Arvind M'}</span>
            <span><i class="far fa-clock" style="color: var(--accent-cyan);"></i> ${blog.read_time}</span>
            <span><i class="fas fa-eye" style="color: var(--accent-cyan);"></i> ${blog.views} views</span>
          </div>
          <div style="display: flex; gap: 10px;">
            <button class="btn btn-outline" style="padding: 6px 12px; font-size: 0.8rem;" onclick="copyArticleLink('${blog.slug}')"><i class="fas fa-link"></i> Copy Link</button>
            <button class="btn btn-outline" style="padding: 6px 12px; font-size: 0.8rem;" onclick="showToast('Article Bookmarked!')"><i class="far fa-bookmark"></i> Bookmark</button>
          </div>
        </div>

        <h1 style="font-size: 2.3rem; margin-bottom: 24px; line-height: 1.3;">${blog.title}</h1>

        <div style="display: grid; grid-template-columns: 240px 1fr; gap: 30px; margin-bottom: 40px;">
          <!-- Sticky Table of Contents -->
          <div style="position: sticky; top: 20px; align-self: start; background: rgba(255,255,255,0.02); padding: 18px; border-radius: var(--radius-md); border: 1px solid var(--border-glass);">
            <h4 style="font-size: 0.95rem; color: var(--accent-cyan); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px;"><i class="fas fa-list"></i> Contents</h4>
            <ul style="list-style: none; font-size: 0.85rem; line-height: 1.8; color: var(--text-muted);">
              <li><a href="#toc-header-1" style="color: var(--text-muted); text-decoration: none;">1. Core Technical Concepts</a></li>
              <li><a href="#toc-header-2" style="color: var(--text-muted); text-decoration: none;">2. Architecture & Workflows</a></li>
              <li><a href="#comments-list" style="color: var(--text-muted); text-decoration: none;">3. Discussion & Comments</a></li>
            </ul>
          </div>

          <!-- Main Article Markdown Content -->
          <div style="line-height: 1.8; font-size: 1.02rem; color: var(--text-main);">
            ${htmlContent}
          </div>
        </div>

        <hr style="border-color: var(--border-glass); margin: 40px 0;" />

        <!-- Related Articles -->
        ${blog.related_articles && blog.related_articles.length > 0 ? `
          <div style="margin-bottom: 40px;">
            <h3 style="font-size: 1.3rem; margin-bottom: 18px; color: var(--accent-cyan);"><i class="fas fa-book-reader"></i> Related AI Guides</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px;">
              ${blog.related_articles.map(r => `
                <div class="glass-card fact-card" style="padding: 16px; cursor: pointer;" onclick="openBlogReader('${r.slug}')">
                  <div style="font-size: 0.78rem; color: var(--accent-cyan); margin-bottom: 6px;">${r.category}</div>
                  <h4 style="font-size: 0.95rem; margin-bottom: 8px;">${r.title}</h4>
                  <div style="font-size: 0.75rem; color: var(--text-dim);"><i class="far fa-clock"></i> ${r.read_time}</div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Comments Section -->
        <h3 style="font-size: 1.4rem; margin-bottom: 20px;"><i class="far fa-comments"></i> Discussion & Comments (${blog.comments.length})</h3>
        <div id="comments-list" style="margin-bottom: 30px;">
          ${blog.comments.map(c => `
            <div style="background: rgba(255,255,255,0.03); padding: 16px; border-radius: var(--radius-md); margin-bottom: 12px; border: 1px solid var(--border-glass);">
              <div style="font-weight: 600; color: var(--accent-cyan); font-size: 0.95rem;">${c.author_name}</div>
              <div style="color: var(--text-muted); font-size: 0.9rem; margin-top: 4px;">${c.comment}</div>
            </div>
          `).join('') || '<div style="color: var(--text-dim); font-size: 0.9rem;">No comments yet. Start the conversation below!</div>'}
        </div>

        <div style="background: var(--bg-card); padding: 24px; border-radius: var(--radius-md); border: 1px solid var(--border-glass);">
          <h4 style="margin-bottom: 16px; font-size: 1.1rem;">Leave a Reply</h4>
          <form onsubmit="submitComment(event, ${blog.id}, '${blog.slug}')">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
              <input type="text" id="comment-name" class="form-input" placeholder="Your Name *" required />
              <input type="email" id="comment-email" class="form-input" placeholder="Your Email *" required />
            </div>
            <textarea id="comment-body" class="form-textarea" rows="3" placeholder="Share your technical insights..." required style="margin-bottom: 16px;"></textarea>
            <button type="submit" class="btn btn-primary" style="padding: 10px 24px;">Post Comment <i class="fas fa-paper-plane"></i></button>
          </form>
        </div>
      `;

      modal.classList.add('active');
    })
    .catch(err => console.error("Error loading blog detail:", err));
}

function copyArticleLink(slug) {
  const fullUrl = `${window.location.origin}/#blog-${slug}`;
  navigator.clipboard.writeText(fullUrl);
  showToast("Article link copied to clipboard!");
}

function submitComment(e, blogId, slug) {
  e.preventDefault();
  const name = document.getElementById('comment-name').value;
  const email = document.getElementById('comment-email').value;
  const comment = document.getElementById('comment-body').value;

  fetch(`/api/blogs/${blogId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ author_name: name, author_email: email, comment: comment })
  })
    .then(res => res.json())
    .then(data => {
      showToast("Comment posted successfully!");
      openBlogReader(slug);
    })
    .catch(err => showToast("Failed to post comment", "error"));
}

function closeBlogModal() {
  const modal = document.getElementById('blog-modal');
  if (modal) modal.classList.remove('active');
}
