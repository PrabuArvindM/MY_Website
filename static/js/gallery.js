/* ==========================================================================
   PRABU ARVIND M - MASONRY GALLERY & FULLSCREEN LIGHTBOX
   ========================================================================== */

const galleryData = [
  { id: 1, category: 'photos', title: 'Prabu Arvind M - AI Developer', src: '/static/assets/images/prabu_profile.png' },
  { id: 2, category: 'certificates', title: 'L&T Construction Internship Certificate', src: '/static/assets/images/LNT_Internship_Certificate.pdf.png' },
  { id: 3, category: 'certificates', title: 'Prime Vector Machine Learning Certificate', src: '/static/assets/images/prime_vector_cert.png' },
  { id: 4, category: 'projects', title: 'PyMorph AI Multi-LLM Code Converter Architecture', src: '/static/assets/images/project_pymorph.jpg' },
  { id: 5, category: 'projects', title: 'News Article Abstractive Summarizer Pipeline', src: '/static/assets/images/project_summarizer.jpg' },
  { id: 6, category: 'projects', title: 'ResNet-34 Cancer Diagnostic Tissue Model', src: '/static/assets/images/project_cancer.jpg' },
  { id: 7, category: 'hackathons', title: 'VIDYUTRENZ 2025 - 1st Runner Up Project Expo', src: '/static/assets/images/award_vidyutrenz.jpg' },
  { id: 8, category: 'certificates', title: 'UI/UX Mega Workshop - NXT-WAVE CCBP 4.0', src: '/static/assets/images/cert_uiux.jpg' }
];

document.addEventListener('DOMContentLoaded', () => {
  renderGallery('all');
  initGalleryFilters();
});

function renderGallery(cat = 'all') {
  const container = document.getElementById('gallery-grid');
  if (!container) return;

  const items = cat === 'all' ? galleryData : galleryData.filter(g => g.category === cat);

  container.innerHTML = items.map(g => `
    <div class="gallery-item fade-in" onclick="openLightbox('${g.src}', '${g.title}')">
      <img src="${g.src}" alt="${g.title}" onerror="this.src='/static/assets/images/prabu_profile.png'" />
      <div class="gallery-overlay">
        <span class="section-tag" style="font-size: 0.7rem; align-self: flex-start; margin-bottom: 6px;">${g.category.toUpperCase()}</span>
        <h4 style="font-size: 1rem; color: #fff;">${g.title}</h4>
      </div>
    </div>
  `).join('');
}

function initGalleryFilters() {
  const pills = document.querySelectorAll('.gallery-filter-pill');
  pills.forEach(p => {
    p.addEventListener('click', () => {
      pills.forEach(item => item.classList.remove('active'));
      p.classList.add('active');
      renderGallery(p.getAttribute('data-cat'));
    });
  });
}

function openLightbox(src, caption) {
  const modal = document.getElementById('lightbox-modal');
  const img = document.getElementById('lightbox-img');
  const cap = document.getElementById('lightbox-caption');

  if (!modal || !img) return;

  img.src = src;
  if (cap) cap.textContent = caption;
  modal.classList.add('active');
}

function closeLightbox() {
  const modal = document.getElementById('lightbox-modal');
  if (modal) modal.classList.remove('active');
}
