/* ================================================================
   KILAGHA DĪ PYĀKHAN — script.js
   Features: loader, particles, nav, scroll reveal, gallery
             lightbox, audio/rhythm visualizer, back-to-top
   ================================================================ */

'use strict';

/* ── 1. LOADING SCREEN ──────────────────────────────────────────── */
(function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  // Hide loader once page has fully loaded (min 1.4s for branding)
  const minDelay = new Promise(res => setTimeout(res, 1400));
  const pageLoad  = new Promise(res => window.addEventListener('load', res));

  Promise.all([minDelay, pageLoad]).then(() => {
    loader.classList.add('hidden');
  });
})();


/* ── 2. PARTICLES (incense smoke / festival lights) ─────────────── */
(function initParticles() {
  const container = document.getElementById('particles-container');
  if (!container) return;

  const PARTICLE_COUNT = 48;
  const COLOURS = [
    'rgba(200,115,42,0.6)',
    'rgba(245,200,120,0.5)',
    'rgba(139,26,46,0.4)',
    'rgba(232,164,88,0.5)',
    'rgba(245,240,220,0.3)',
    'rgba(200,115,42,0.3)',
  ];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const p = document.createElement('div');
    p.className = 'particle';

    const size   = 2 + Math.random() * 5;
    const left   = Math.random() * 100;
    const delay  = Math.random() * 12;
    const dur    = 8 + Math.random() * 12;
    const drift  = (Math.random() - 0.5) * 120;
    const colour = COLOURS[Math.floor(Math.random() * COLOURS.length)];

    p.style.cssText = `
      left:${left}%;
      bottom:${-size}px;
      width:${size}px;
      height:${size}px;
      background:${colour};
      animation-delay:${delay}s;
      animation-duration:${dur}s;
      --drift:${drift}px;
      box-shadow: 0 0 ${size * 2}px ${colour};
    `;

    container.appendChild(p);
  }
})();


/* ── 3. STICKY NAVBAR ───────────────────────────────────────────── */
(function initNavbar() {
  const navbar     = document.getElementById('navbar');
  const navToggle  = document.getElementById('navToggle');
  const navLinks   = document.getElementById('navLinks');
  if (!navbar) return;

  // Scroll class
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile toggle
  navToggle && navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open);
    // Prevent body scroll when menu open
    document.body.style.overflow = open ? 'hidden' : '';
  });

  // Close menu on link click
  navLinks && navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
      navToggle && navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Active link highlighting on scroll
  const sections = document.querySelectorAll('section[id], footer[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => sectionObserver.observe(s));
})();


/* ── 4. SCROLL REVEAL ───────────────────────────────────────────── */
(function initReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  reveals.forEach(el => observer.observe(el));
})();


/* ── 5. PARALLAX (hero mandala) ─────────────────────────────────── */
(function initParallax() {
  const mandala = document.querySelector('.hero-mandala-bg');
  const maskArt = document.querySelector('.hero-mask-art');
  if (!mandala) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (mandala) mandala.style.transform = `translateY(${y * 0.25}px)`;
        if (maskArt)  maskArt.style.transform  = `translateY(calc(-50% + ${y * 0.18}px))`;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();


/* ── 6. GALLERY LIGHTBOX ────────────────────────────────────────── */
(function initGallery() {
  const items      = document.querySelectorAll('.gallery-item');
  const lightbox   = document.getElementById('lightbox');
  const lbClose    = document.getElementById('lightboxClose');
  const lbPrev     = document.getElementById('lightboxPrev');
  const lbNext     = document.getElementById('lightboxNext');
  const lbImage    = document.getElementById('lightboxImage');
  const lbCaption  = document.getElementById('lightboxCaption');
  if (!lightbox || !items.length) return;

  let current = 0;

  // Build data array
  const data = Array.from(items).map(item => ({
    caption: item.dataset.caption || '',
    bgStyle: item.querySelector('.gallery-img-wrap')?.style.background || '',
    svgContent: item.querySelector('.gallery-placeholder-art')?.innerHTML || '',
  }));

  function openLightbox(index) {
    current = ((index % data.length) + data.length) % data.length;
    const d = data[current];

    lbImage.style.background = d.bgStyle;
    lbImage.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;padding:2rem;">${d.svgContent}</div>`;
    lbCaption.textContent = d.caption;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Focus trap
    lbClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  items.forEach((item, i) => {
    item.addEventListener('click', () => openLightbox(i));
    item.setAttribute('role', 'button');
    item.setAttribute('tabindex', '0');
    item.addEventListener('keydown', e => { if (e.key === 'Enter') openLightbox(i); });
  });

  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', () => openLightbox(current - 1));
  lbNext.addEventListener('click', () => openLightbox(current + 1));

  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') openLightbox(current - 1);
    if (e.key === 'ArrowRight') openLightbox(current + 1);
  });
})();


/* ── 7. RHYTHM VISUALIZER + AUDIO PLAYER UI ─────────────────────── */
(function initAudioPlayer() {
  const playBtn  = document.getElementById('playBtn');
  const vizBars  = document.getElementById('vizBars');
  const progress = document.getElementById('audioProgressFill');
  const timeEl   = document.getElementById('audioTime');
  if (!playBtn || !vizBars) return;

  // ─ Build visualizer bars ─
  const BAR_COUNT = 40;
  const bars = [];

  for (let i = 0; i < BAR_COUNT; i++) {
    const bar = document.createElement('div');
    bar.className = 'viz-bar';
    bar.style.height = '4px';
    vizBars.appendChild(bar);
    bars.push(bar);
  }

  // ─ Dhime rhythm pattern ─
  // Represents the 8-beat rhythmic cycle of Newar dhime music
  // Values: 0–1 relative amplitude
  const DHIME_PATTERN = [
    1.0, 0.3, 0.7, 0.2, 0.85, 0.15, 0.6, 0.3,
    0.9, 0.25, 0.65, 0.1, 1.0, 0.2, 0.55, 0.35,
    0.8, 0.3, 0.7, 0.15, 0.9, 0.25, 0.6, 0.2,
    0.75, 0.35, 0.65, 0.1, 0.85, 0.3, 0.5, 0.25,
    0.95, 0.2, 0.7, 0.15, 0.8, 0.35, 0.55, 0.3
  ];

  let isPlaying  = false;
  let startTime  = 0;
  let elapsed    = 0;
  let rafId      = null;
  const DURATION = 120; // seconds (2 min simulated)
  const TEMPO    = 0.8; // beats per second

  // Play icon (triangle) / Pause icon (two rects)
  const PLAY_ICON  = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="20" height="20"><polygon points="5,3 19,12 5,21" fill="currentColor"/></svg>`;
  const PAUSE_ICON = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="20" height="20"><rect x="6" y="4" width="4" height="16" fill="currentColor"/><rect x="14" y="4" width="4" height="16" fill="currentColor"/></svg>`;

  function animateBars(timestamp) {
    const beat = (elapsed * TEMPO * 2) % 1; // 0–1 within beat
    const beatIndex = Math.floor(elapsed * TEMPO * 2) % DHIME_PATTERN.length;

    bars.forEach((bar, i) => {
      // Each bar oscillates with different phase, influenced by dhime pattern
      const phase  = (i / BAR_COUNT) * Math.PI * 2;
      const base   = DHIME_PATTERN[(beatIndex + Math.floor(i * 0.8)) % DHIME_PATTERN.length];
      const wave   = Math.sin(elapsed * 6 + phase) * 0.25 + 0.75;
      const accent = Math.sin(beat * Math.PI) * 0.4; // beat accent
      const height = Math.max(3, Math.round((base * wave + accent * base) * 55));
      bar.style.height = height + 'px';
    });

    // Update progress
    const pct = Math.min((elapsed / DURATION) * 100, 100);
    progress.style.width = pct + '%';

    // Update time
    const mins = Math.floor(elapsed / 60);
    const secs = Math.floor(elapsed % 60).toString().padStart(2, '0');
    timeEl.textContent = `${mins}:${secs}`;

    if (elapsed >= DURATION) {
      stop();
      return;
    }

    elapsed = (Date.now() - startTime) / 1000;
    rafId = requestAnimationFrame(animateBars);
  }

  function flattenBars() {
    bars.forEach(bar => { bar.style.height = '4px'; });
  }

  function play() {
    isPlaying = true;
    startTime = Date.now() - elapsed * 1000;
    rafId = requestAnimationFrame(animateBars);
    playBtn.innerHTML = PAUSE_ICON;
    playBtn.setAttribute('aria-label', 'Pause rhythm visualizer');
  }

  function pause() {
    isPlaying = false;
    cancelAnimationFrame(rafId);
    playBtn.innerHTML = PLAY_ICON;
    playBtn.setAttribute('aria-label', 'Play rhythm visualizer');
  }

  function stop() {
    pause();
    elapsed = 0;
    progress.style.width = '0%';
    timeEl.textContent = '0:00';
    flattenBars();
  }

  playBtn.addEventListener('click', () => {
    if (isPlaying) pause();
    else play();
  });

  // Allow clicking progress bar to seek
  document.getElementById('audioProgress')?.addEventListener('click', e => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct  = (e.clientX - rect.left) / rect.width;
    elapsed    = pct * DURATION;
    if (isPlaying) startTime = Date.now() - elapsed * 1000;
  });
})();


/* ── 8. BACK TO TOP ─────────────────────────────────────────────── */
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


/* ── 9. SMOOTH ANCHOR SCROLLING ─────────────────────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80; // navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* ── 10. LAZY IMAGE LOADING (for future real images) ────────────── */
(function initLazyLoad() {
  // When real <img> tags are added, they'll benefit from native lazy loading
  // For now, we add the loading attribute programmatically
  document.querySelectorAll('img').forEach(img => {
    if (!img.hasAttribute('loading')) {
      img.setAttribute('loading', 'lazy');
    }
  });
})();


/* ── 11. DEITY CARDS — touch support for flip ───────────────────── */
(function initDeityCards() {
  // On touch devices, cards flip on tap (no hover)
  const cards = document.querySelectorAll('.deity-card');

  if ('ontouchstart' in window) {
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const inner = card.querySelector('.deity-card-inner');
        if (!inner) return;
        const isFlipped = inner.style.transform === 'rotateY(180deg)';
        inner.style.transform = isFlipped ? '' : 'rotateY(180deg)';
      });
    });
  }
})();


/* ── 12. KEYBOARD ACCESSIBILITY: deity cards ────────────────────── */
(function initDeityKeyboard() {
  document.querySelectorAll('.deity-card').forEach(card => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });
})();


/* ── 13. SECTION ENTRY ANIMATIONS ───────────────────────────────── */
(function initSectionHeaderAnimations() {
  // Animate ornament-line when section header enters view
  const ornaments = document.querySelectorAll('.ornament-line');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const spans = entry.target.querySelectorAll('span:not(.ornament-diamond)');
        spans.forEach(span => {
          span.style.transition = 'width 0.8s cubic-bezier(0.16,1,0.3,1)';
        });
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  ornaments.forEach(el => obs.observe(el));
})();


/* ── 14. TIMELINE DOT PULSE on enter ────────────────────────────── */
(function initTimelineDots() {
  const dots = document.querySelectorAll('.timeline-dot');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const svg = entry.target.querySelector('circle:last-child');
        if (svg) {
          svg.style.transition = 'r 0.4s ease';
        }
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.8 });

  dots.forEach(d => obs.observe(d));
})();


/* ── 15. CONSOLE GREETING ────────────────────────────────────────── */
console.log(
  '%cकिलागल दी प्याखं\n%cKilagha Dī Pyākhan — Sacred Masked Dance of Kathmandu\nBuilt with love for the Jyapu Newar community.',
  'font-size:1.4rem;color:#c8732a;font-weight:bold;',
  'font-size:0.9rem;color:#8b1a2e;'
);
