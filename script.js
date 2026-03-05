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
  const heroTag    = document.querySelector('.hero__tag');
  const heroH1     = document.querySelector('.hero__h1');
  const heroSub    = document.querySelector('.hero__sub');
  const heroVisual = document.querySelector('.hero__visual');
  const heroStats  = document.querySelector('.hero__stats');
  const heroBtns   = document.querySelector('.hero__btns');

  if (heroTag)    setTimeout(() => heroTag.classList.add('visible'), 200);
  if (heroH1)     setTimeout(() => heroH1.classList.add('visible'), 400);
  if (heroVisual) setTimeout(() => heroVisual.classList.add('visible'), 500);
  // Subtitle appears 3s after load
  if (heroSub)    setTimeout(() => heroSub.classList.add('visible'), 3000);
  if (heroStats)  setTimeout(() => heroStats.classList.add('visible'), 3400);
  if (heroBtns)   setTimeout(() => heroBtns.classList.add('visible'), 3600);

  // ===========================
  // SALES ANIMATION STATE MACHINE
  // Scatter → Travel Line → Organize → Leads Zoom → Bar Chart (pauses)
  // ===========================
  (function initAnim() {
    const sa      = document.getElementById('sa');
    const saP1    = document.getElementById('saP1');
    const saP2    = document.getElementById('saP2');
    const saSvg   = document.getElementById('saSvg');
    const saStage = document.getElementById('saStage');
    const saLeads = document.getElementById('saLeads');
    if (!sa || !saP1 || !saSvg || !saStage || !saLeads) return;

    const nodeIds = ['san0','san1','san2','san3','san4','san5','san6'];
    const nodes   = nodeIds.map(id => document.getElementById(id)).filter(Boolean);
    if (nodes.length < 7) return;

    // Coordinate space: 420×300 matching SVG viewBox
    const scattered = [
      {x:285, y:5},   {x:372, y:88},  {x:318, y:215},
      {x:160, y:262}, {x:28,  y:220}, {x:8,   y:75},  {x:130, y:12}
    ];
    const organized  = nodes.map((_, i) => ({ x: 8,  y: 12 + i * 40 }));
    const leadsPos   = { x: 339, y: 102 };
    const leadsCenter= { x: 363, y: 126 };
    const NODE_SIZE  = 36;

    // Scale stage to fit container
    function scaleStage() {
      const w = sa.offsetWidth - 32;
      const s = Math.min(w / 420, 1);
      saStage.style.transform = `scale(${s})`;
      saStage.style.transformOrigin = 'top left';
      sa.style.minHeight = Math.ceil(300 * s + 52) + 'px';
    }
    scaleStage();
    window.addEventListener('resize', scaleStage);

    const nc = pos => ({ x: pos.x + NODE_SIZE/2, y: pos.y + NODE_SIZE/2 });

    function clearSvg() { saSvg.innerHTML = ''; }

    function polyLen(pts) {
      let l = 0;
      for (let i = 1; i < pts.length; i++) {
        const dx = pts[i].x - pts[i-1].x, dy = pts[i].y - pts[i-1].y;
        l += Math.sqrt(dx*dx + dy*dy);
      }
      return l;
    }

    // STEP 1: Show channels scattered
    function step1() {
      clearSvg();
      saStage.classList.remove('sa--organised');
      saLeads.style.opacity = '0';
      saLeads.style.transform = 'scale(1)';
      saLeads.style.left = leadsPos.x + 'px';
      saLeads.style.top  = leadsPos.y + 'px';
      nodes.forEach((n, i) => {
        n.style.transition = 'none';
        n.style.left = scattered[i].x + 'px';
        n.style.top  = scattered[i].y + 'px';
        n.style.opacity = '0';
      });
      nodes.forEach((n, i) => setTimeout(() => {
        n.style.transition = 'opacity 0.35s ease';
        n.style.opacity = '1';
      }, 100 + i * 130));
      setTimeout(step2, 100 + nodes.length * 130 + 500);
    }

    // STEP 2: Traveling polyline through scattered nodes
    function step2() {
      const pts = [...scattered.map(nc), nc(scattered[0])];
      const len = Math.ceil(polyLen(pts)) + 10;
      const pl = document.createElementNS('http://www.w3.org/2000/svg','polyline');
      pl.setAttribute('points', pts.map(p => `${p.x},${p.y}`).join(' '));
      pl.setAttribute('class','sa__line-travel');
      pl.style.strokeDasharray = len;
      pl.style.strokeDashoffset = len;
      saSvg.appendChild(pl);
      requestAnimationFrame(() => {
        pl.style.transition = 'stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1)';
        pl.style.strokeDashoffset = '0';
      });
      setTimeout(step3, 1700);
    }

    // STEP 3: Slide to column, show leads, draw fan lines
    function step3() {
      clearSvg();
      saStage.classList.add('sa--organised');
      nodes.forEach((n, i) => {
        n.style.transition = 'left 0.65s cubic-bezier(0.4,0,0.2,1), top 0.65s cubic-bezier(0.4,0,0.2,1)';
        n.style.left = organized[i].x + 'px';
        n.style.top  = organized[i].y + 'px';
      });
      setTimeout(() => {
        saLeads.style.transition = 'opacity 0.4s ease';
        saLeads.style.opacity = '1';
        // Fan lines
        nodes.forEach((_, i) => {
          const from = nc(organized[i]);
          const line = document.createElementNS('http://www.w3.org/2000/svg','line');
          line.setAttribute('x1', from.x + NODE_SIZE/2); line.setAttribute('y1', from.y);
          line.setAttribute('x2', leadsCenter.x - 24);   line.setAttribute('y2', leadsCenter.y);
          line.setAttribute('class','sa__line-fan');
          saSvg.appendChild(line);
          setTimeout(() => line.classList.add('show'), i * 70);
        });
      }, 700);
      setTimeout(step4, 700 + nodes.length * 70 + 800);
    }

    // STEP 4: Zoom leads → transition to chart
    function step4() {
      saLeads.style.transition = 'transform 0.45s cubic-bezier(0.34,1.56,0.64,1), opacity 0.4s ease';
      saLeads.style.transform = 'scale(1.7)';
      saLeads.style.opacity = '0.1';
      setTimeout(() => {
        saP1.style.transition = 'opacity 0.4s ease';
        saP1.style.opacity = '0';
        saP1.style.pointerEvents = 'none';
        saP2.classList.remove('sa__phase--out');
        saP2.style.opacity = '1';
        saP2.style.transform = 'translateY(0)';
        setTimeout(step5, 150);
      }, 380);
    }

    // STEP 5: Animate bar chart — PAUSES
    function step5() {
      // Animate counters
      document.querySelectorAll('.sa__kpi-val').forEach(el => {
        const from = parseInt(el.dataset.from), to = parseInt(el.dataset.to);
        const suffix = el.dataset.suffix || '', dur = 1200, t0 = performance.now();
        (function tick(now) {
          const p = Math.min((now - t0) / dur, 1), e = 1 - Math.pow(1-p, 3);
          el.textContent = Math.round(from + (to - from) * e) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        })(performance.now());
      });
      // SVG bars grow from bottom
      document.querySelectorAll('.sa__sb').forEach((bar, i) => {
        setTimeout(() => {
          const h = parseInt(bar.dataset.h);
          bar.setAttribute('y', 40 - h);
          bar.setAttribute('height', h);
        }, 60 + i * 50);
      });
    }

    // Start
    setTimeout(step1, 600);
  })();

  // ===========================
  // COUNTER ANIMATION (stats)
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
