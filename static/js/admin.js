/* ==========================================================================
   PRABU ARVIND M - BLOG ADMIN PANEL MODULE
   ========================================================================== */

let adminPasscode = '';

function openAdminModal() {
  const modal = document.getElementById('admin-modal');
  if (modal) modal.classList.add('active');
}

function closeAdminModal() {
  const modal = document.getElementById('admin-modal');
  if (modal) modal.classList.remove('active');
}

function handleAdminLogin(e) {
  e.preventDefault();
  const passcode = document.getElementById('admin-passcode').value;

  fetch('/api/blogs/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ passcode })
  })
    .then(res => res.json())
    .then(data => {
      if (data.status === 'success') {
        adminPasscode = passcode;
        showToast("Authenticated as Admin!");
        document.getElementById('admin-login-view').style.display = 'none';
        document.getElementById('admin-dashboard-view').style.display = 'block';
      } else {
        showToast("Invalid admin passcode", "error");
      }
    })
    .catch(err => showToast("Authentication failed", "error"));
}

function handleCreateBlogPost(e) {
  e.preventDefault();
  const title = document.getElementById('new-post-title').value;
  const category = document.getElementById('new-post-category').value;
  const summary = document.getElementById('new-post-summary').value;
  const content = document.getElementById('new-post-content').value;
  const banner = document.getElementById('new-post-banner').value || '/static/assets/images/blog_fastapi.jpg';
  const readTime = document.getElementById('new-post-readtime').value || '5 min read';

  fetch('/api/blogs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Admin-Passcode': adminPasscode
    },
    body: JSON.stringify({ title, category, summary, content, banner_image: banner, read_time: readTime })
  })
    .then(res => res.json())
    .then(data => {
      if (data.status === 'success') {
        showToast("New blog post published successfully!");
        closeAdminModal();
        fetchBlogs(); // Reload blog list
      } else {
        showToast(data.detail || "Error publishing post", "error");
      }
    })
    .catch(err => showToast("Failed to create blog post", "error"));
}
