/* ==========================================================================
   PRABU ARVIND M - MAIN JAVASCRIPT & NEURAL CANVAS ANIMATION
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initNeuralCanvas();
  initTypingEffect();
  initStatsCounter();
  initScrollHandlers();
  initMobileMenu();
});

/* 0. Preloader Handler */
function initPreloader() {
  const loader = document.getElementById('ai-preloader');
  if (loader) {
    setTimeout(() => {
      loader.style.opacity = '0';
      loader.style.visibility = 'hidden';
    }, 600);
  }
}

/* 1. Interactive Neural Network Particle Canvas */
function initNeuralCanvas() {
  const canvas = document.getElementById('neural-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = canvas.width = canvas.parentElement.clientWidth;
  let height = canvas.height = canvas.parentElement.clientHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = canvas.parentElement.clientWidth;
    height = canvas.height = canvas.parentElement.clientHeight;
  });

  const mouse = { x: null, y: null, radius: 150 };

  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  const particleCount = Math.floor((width * height) / 12000);
  const particles = [];

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.8;
      this.vy = (Math.random() - 0.5) * 0.8;
      this.radius = Math.random() * 2 + 1;
      this.color = Math.random() > 0.5 ? '#00f2fe' : '#7928ca';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse attraction / repulsion physics
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 3;
          this.y -= (dy / dist) * force * 3;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = this.color;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Connect particles with glowing neural lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          const alpha = 1 - dist / 120;
          ctx.strokeStyle = `rgba(0, 242, 254, ${alpha * 0.35})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* 2. Typing Effect cycling through exact prompt titles */
function initTypingEffect() {
  const target = document.getElementById('hero-typing');
  if (!target) return;

  const titles = [
    "Artificial Intelligence Engineer",
    "Machine Learning Developer",
    "Deep Learning Enthusiast",
    "Python Backend Developer",
    "AI Research Enthusiast",
    "Computer Vision Learner"
  ];

  let titleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let speed = 80;

  function type() {
    const currentTitle = titles[titleIndex];

    if (isDeleting) {
      target.textContent = currentTitle.substring(0, charIndex - 1);
      charIndex--;
      speed = 40;
    } else {
      target.textContent = currentTitle.substring(0, charIndex + 1);
      charIndex++;
      speed = 80;
    }

    if (!isDeleting && charIndex === currentTitle.length) {
      speed = 2000; // Pause at full title
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      titleIndex = (titleIndex + 1) % titles.length;
      speed = 400;
    }

    setTimeout(type, speed);
  }

  type();
}

/* 3. Animated Counter Statistics */
function initStatsCounter() {
  const counters = document.querySelectorAll('.stat-number');
  if (counters.length === 0) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const targetNum = parseInt(counter.getAttribute('data-target'));
        const suffix = counter.getAttribute('data-suffix') || '';
        let current = 0;
        const increment = targetNum / 40;

        const updateCount = () => {
          current += increment;
          if (current < targetNum) {
            counter.textContent = Math.ceil(current) + suffix;
            setTimeout(updateCount, 40);
          } else {
            counter.textContent = targetNum + suffix;
          }
        };

        updateCount();
        obs.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

/* 4. Scroll Progress & Nav Highlight & Back-to-Top */
function initScrollHandlers() {
  const progressBar = document.getElementById('scroll-progress');
  const backToTop = document.getElementById('back-to-top');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    if (progressBar) {
      progressBar.style.width = `${scrollPercent}%`;
    }

    if (backToTop) {
      if (scrollTop > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }

    // Nav Active Section Link
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (scrollTop >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* 5. Mobile Navigation Toggle */
function initMobileMenu() {
  const toggle = document.querySelector('.mobile-toggle');
  const nav = document.querySelector('.nav-links');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      toggle.innerHTML = nav.classList.contains('open') ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        toggle.innerHTML = '<i class="fas fa-bars"></i>';
      });
    });
  }
}

/* 6. Global Toast Notification Helper */
function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  container.innerHTML = ''; // Clear stale toasts

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icon = type === 'success' ? '<i class="fas fa-check-circle" style="color: #00e676;"></i>' : '<i class="fas fa-exclamation-circle" style="color: #ff0080;"></i>';
  toast.innerHTML = `${icon} <span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-100%)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
