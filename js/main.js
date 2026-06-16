/* ════════════════════════════════════
   MAIN JAVASCRIPT
   ════════════════════════════════════ */

(function () {
  'use strict';

  // ─── 1. Scroll Progress Indicator ───
  const scrollProgress = document.querySelector('.scroll-progress');
  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (scrollProgress) {
      scrollProgress.style.width = progress + '%';
    }
  }

  // ─── 2. IntersectionObserver — scroll-triggered fade-in ───
  const animatedSections = document.querySelectorAll('.animate-section');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        sectionObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  animatedSections.forEach(section => sectionObserver.observe(section));

  // ─── 3. Navbar border on scroll past 80px ───
  const navbar = document.getElementById('navbar');
  function updateNavbar() {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  // ─── 4. Parallax on abstract composition ───
  const abstractComp = document.querySelector('.abstract-composition');
  function updateParallax() {
    if (!abstractComp) return;
    const scrollY = window.scrollY;
    const heroHeight = document.querySelector('.hero')?.offsetHeight || 800;
    if (scrollY < heroHeight) {
      const parallaxY = scrollY * 0.15;
      abstractComp.classList.add('parallax');
      abstractComp.style.setProperty('--parallax-y', parallaxY + 'px');
    }
  }

  // ─── 5. Animated stat counters ───
  let statsAnimated = false;
  const statNumbers = document.querySelectorAll('.stat-number');

  function animateCounter(el) {
    const text = el.textContent.trim();
    // Parse patterns like "1+ yrs", "8+", "2"
    const match = text.match(/^(\d+)(.*)$/);
    if (!match) return;

    const target = parseInt(match[1], 10);
    const suffix = match[2]; // e.g. "+ yrs", "+", ""
    const duration = 1200;
    const startTime = performance.now();

    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = current + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  const statStripEl = document.querySelector('.stat-strip');
  if (statStripEl) {
    const statObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !statsAnimated) {
          statsAnimated = true;
          statNumbers.forEach((el, i) => {
            setTimeout(() => animateCounter(el), i * 200);
          });
          statObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    statObserver.observe(statStripEl);
  }

  // ─── 6. Scroll event — throttled ───
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateScrollProgress();
        updateNavbar();
        updateParallax();
        ticking = false;
      });
      ticking = true;
    }
  });

  // ─── 7. Hamburger menu toggle ───
  const hamburger = document.getElementById('hamburger');
  const mobileOverlay = document.getElementById('mobileOverlay');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileOverlay.classList.toggle('open');
    document.body.style.overflow = mobileOverlay.classList.contains('open') ? 'hidden' : '';
  });

  // Close mobile menu on link click
  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileOverlay.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ─── 8. Smooth scroll for anchor links ───
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ─── 9. Active nav highlight ───
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[data-section]');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('data-section') === id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(section => navObserver.observe(section));

  // ─── 10. Clickable case cards ───
  document.querySelectorAll('.case-card[data-href]').forEach(card => {
    card.addEventListener('click', function () {
      const target = document.querySelector(this.getAttribute('data-href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('data-href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // ─── 11. Initial calls ───
  updateScrollProgress();
  updateNavbar();

})();
