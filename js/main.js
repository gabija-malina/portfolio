// Dark mode toggle
document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.querySelector('[data-theme-toggle]');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      if (isDark) {
        document.documentElement.removeAttribute('data-theme');
        try { localStorage.setItem('theme', 'light'); } catch (e) {}
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        try { localStorage.setItem('theme', 'dark'); } catch (e) {}
      }
    });
  }
});

// Mobile nav toggle
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('nav.primary');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Exhibition page: reveal catalogue sections gently as they enter the
  // viewport, and replace any unfinished date placeholders with the era
  // heading that already supplies the correct context.
  document.querySelectorAll('.timeline-era').forEach((era) => {
    const eraLabel = era.querySelector('h3')?.textContent.trim();
    if (!eraLabel) return;
    era.querySelectorAll('.cap-meta').forEach((meta) => {
      meta.textContent = meta.textContent.replace(/\bYear\b/g, eraLabel);
    });
  });

  const revealItems = document.querySelectorAll('.reveal-on-scroll');
  if (revealItems.length) {
    document.body.classList.add('reveal-ready');
    if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.12 });
      revealItems.forEach((item) => revealObserver.observe(item));
    } else {
      revealItems.forEach((item) => item.classList.add('is-visible'));
    }
  }

  // Lightbox for gallery pieces
  const lightbox = document.querySelector('.lightbox');
  if (!lightbox) return;

  const track = lightbox.querySelector('.lightbox-track');
  const dotsWrap = lightbox.querySelector('.lightbox-dots');
  const caption = lightbox.querySelector('.lightbox-caption');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');

  let imageCount = 0;

  function currentIndex() {
    return Math.round(track.scrollLeft / track.clientWidth);
  }

  // Wraps around: past the last image goes to the first, and vice versa
  function goToIndex(i) {
    if (imageCount < 2) return;
    const idx = ((i % imageCount) + imageCount) % imageCount;
    track.scrollTo({ left: track.clientWidth * idx, behavior: 'smooth' });
  }

  function openLightbox(piece) {
    const title = piece.querySelector('.title')?.textContent || '';
    const meta = piece.querySelector('.meta')?.textContent || '';
    const figcap = piece.querySelector('figcaption')?.textContent || '';
    const thumb = piece.querySelector('img');

    // Pieces can list multiple images to scroll through via
    // data-images='["a.jpg","b.jpg"]'. Falls back to the single
    // thumbnail image if that attribute isn't set.
    let images = [];
    if (piece.dataset.images) {
      try { images = JSON.parse(piece.dataset.images); } catch (e) { images = []; }
    }
    if (!images.length) {
      if (thumb) images = [thumb.src];
    }

    // Open the carousel on the exact thumbnail that was selected.
    // Comparing absolute URLs keeps this reliable across language pages
    // with different relative path depths.
    const normalizeUrl = (src) => {
      try { return new URL(src, document.baseURI).href; } catch (e) { return src; }
    };
    const thumbUrl = thumb ? normalizeUrl(thumb.currentSrc || thumb.src) : '';
    const matchingIndex = images.findIndex((src) => normalizeUrl(src) === thumbUrl);
    const startIndex = matchingIndex >= 0 ? matchingIndex : 0;

    track.innerHTML = '';
    dotsWrap.innerHTML = '';
    imageCount = images.length;
    track.classList.toggle('has-multiple', imageCount > 1);
    prevBtn.style.display = imageCount > 1 ? '' : 'none';
    nextBtn.style.display = imageCount > 1 ? '' : 'none';

    images.forEach((src, i) => {
      const img = document.createElement('img');
      img.src = src;
      img.alt = title || figcap;
      track.appendChild(img);

      if (images.length > 1) {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.setAttribute('aria-label', `View image ${i + 1} of ${images.length}`);
        if (i === startIndex) dot.classList.add('active');
        dot.addEventListener('click', () => {
          track.scrollTo({ left: track.clientWidth * i, behavior: 'smooth' });
        });
        dotsWrap.appendChild(dot);
      }
    });

    caption.textContent = (title || meta) ? [title, meta].filter(Boolean).join(' — ') : figcap;
    lightbox.classList.add('open');
    requestAnimationFrame(() => {
      track.scrollLeft = track.clientWidth * startIndex;
    });
    closeBtn.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    track.innerHTML = '';
    dotsWrap.innerHTML = '';
    imageCount = 0;
  }

  document.querySelectorAll('.piece, .project-shot, .artwork-gallery figure, .featured-artworks figure, .artwork-grid figure, .artwork-columns figure, .feature-pair figure, .exhibition-article .grid-item').forEach((piece) => {
    piece.setAttribute('tabindex', '0');
    piece.setAttribute('role', 'button');
    piece.addEventListener('click', () => openLightbox(piece));
    piece.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(piece);
      }
    });
  });

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    goToIndex(currentIndex() - 1);
  });
  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    goToIndex(currentIndex() + 1);
  });

  // Clicking the enlarged image itself advances to the next one
  track.addEventListener('click', (e) => {
    if (e.target.tagName === 'IMG' && imageCount > 1) {
      goToIndex(currentIndex() + 1);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') goToIndex(currentIndex() + 1);
    if (e.key === 'ArrowLeft') goToIndex(currentIndex() - 1);
  });

  // Keep the active dot in sync while scrolling through images
  track.addEventListener('scroll', () => {
    const dots = dotsWrap.querySelectorAll('button');
    if (!dots.length) return;
    const idx = Math.round(track.scrollLeft / track.clientWidth);
    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
  });
});
