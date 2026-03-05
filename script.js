/* ===========================
   VENTAS CON SONIA FERRER
   script.js
   =========================== */

document.addEventListener('DOMContentLoaded', () => {

  // ===========================
  // NAV: Scroll effect + burger
  // ===========================
  const nav = document.getElementById('nav');
  const burger = document.getElementById('burger');
  const navMenu = document.getElementById('navMenu');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });

  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    navMenu.classList.toggle('open');
  });

  // Close menu on link click
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('open');
      navMenu.classList.remove('open');
    });
  });

  // ===========================
  // SCROLL ANIMATIONS (fade-up)
  // ===========================
  const fadeEls = document.querySelectorAll('.fade-up');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  fadeEls.forEach(el => observer.observe(el));

  // Hero elements visible immediately with staggered timing
  const heroTag = document.querySelector('.hero__tag');
  const heroH1 = document.querySelector('.hero__h1');
  const heroSub = document.querySelector('.hero__sub');
  const heroVisual = document.querySelector('.hero__visual');
  const heroStats = document.querySelector('.hero__stats');
  const heroBtns = document.querySelector('.hero__btns');

  if (heroTag) setTimeout(() => heroTag.classList.add('visible'), 200);
  if (heroH1) setTimeout(() => heroH1.classList.add('visible'), 400);
  if (heroVisual) setTimeout(() => heroVisual.classList.add('visible'), 500);
  // Subtitle appears later — the key effect
  if (heroSub) setTimeout(() => heroSub.classList.add('visible'), 1800);
  if (heroStats) setTimeout(() => heroStats.classList.add('visible'), 2200);
  if (heroBtns) setTimeout(() => heroBtns.classList.add('visible'), 2400);

  // ===========================
  // COUNTER ANIMATION
  // ===========================
  const counters = document.querySelectorAll('.counter');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-to'));
    const duration = 1800;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target;
    }

    requestAnimationFrame(update);
  }

  // ===========================
  // SMOOTH SCROLL for anchors
  // ===========================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ===========================
  // FORM: Basic UX enhancement
  // ===========================
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', (e) => {
      const btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.textContent = 'Enviando...';
        btn.disabled = true;
        setTimeout(() => {
          btn.textContent = '¡Enviado! ✓';
          btn.style.background = '#22c55e';
          btn.style.borderColor = '#22c55e';
        }, 1500);
      }
    });
  });

  // ===========================
  // ACTIVE NAV LINK on scroll
  // ===========================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__menu a');

  function updateActiveLink() {
    const scrollPos = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < bottom) {
        navLinks.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === `#${id}`) {
            link.style.color = '#F66F19';
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });

});
