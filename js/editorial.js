/* ═══════════════════════════════════════════════════════════
   EDITORIAL — interactions (vanilla, dependency-free)
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── Theme toggle ──────────────────────────────────────── */
  // Note: initial theme is set by an inline script in <head> to avoid FOUC.
  const root = document.documentElement;
  const toggle = document.getElementById('theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
      toggle.setAttribute('aria-label', next === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    });
  }

  /* ── Nav: scrolled border + progress bar ───────────────── */
  const nav = document.getElementById('site-nav');
  const progress = document.getElementById('scroll-progress');
  function onScroll() {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 8);
    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = max > 0 ? (window.scrollY / max) * 100 + '%' : '0%';
    }
    const top = document.getElementById('to-top');
    if (top) top.classList.toggle('show', window.scrollY > 400);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Mobile menu ───────────────────────────────────────── */
  const menuBtn = document.getElementById('menu-btn');
  const navLinks = document.getElementById('nav-links');
  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      const open = menuBtn.classList.toggle('open');
      navLinks.classList.toggle('mobile-open', open);
      menuBtn.setAttribute('aria-expanded', open);
    });
    navLinks.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        menuBtn.classList.remove('open');
        navLinks.classList.remove('mobile-open');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ── Resume dropdown ───────────────────────────────────── */
  const resumeWrap = document.getElementById('resume-wrap');
  const resumeBtn = document.getElementById('resume-btn');
  if (resumeWrap && resumeBtn) {
    resumeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = resumeWrap.classList.toggle('open');
      resumeBtn.setAttribute('aria-expanded', open);
    });
    document.addEventListener('click', (e) => {
      if (!resumeWrap.contains(e.target)) {
        resumeWrap.classList.remove('open');
        resumeBtn.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') resumeWrap.classList.remove('open');
    });
  }

  /* ── Active nav link on scroll ─────────────────────────── */
  const sections = Array.from(document.querySelectorAll('section[id]'));
  const linkFor = {};
  document.querySelectorAll('#nav-links a[href^="#"]').forEach((a) => {
    linkFor[a.getAttribute('href').slice(1)] = a;
  });
  if (sections.length) {
    window.addEventListener('scroll', () => {
      const mid = window.scrollY + window.innerHeight / 3;
      let current = '';
      sections.forEach((sec) => {
        if (mid >= sec.offsetTop && mid < sec.offsetTop + sec.offsetHeight) current = sec.id;
      });
      Object.keys(linkFor).forEach((id) => linkFor[id].classList.toggle('active', id === current));
    }, { passive: true });
  }

  /* ── Typed role rotation ───────────────────────────────── */
  const typed = document.getElementById('typed-role');
  if (typed && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const phrases = ['Software Development Engineer', 'Machine Learning Engineer'];
    let pi = 0, ci = 0, deleting = false;
    function tick() {
      const phrase = phrases[pi];
      ci += deleting ? -1 : 1;
      typed.textContent = phrase.slice(0, ci);
      let delay = deleting ? 45 : 80;
      if (!deleting && ci === phrase.length) { delay = 2400; deleting = true; }
      else if (deleting && ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; delay = 350; }
      setTimeout(tick, delay);
    }
    setTimeout(tick, 900);
  } else if (typed) {
    typed.textContent = 'Software Development Engineer';
  }

  /* ── Count-up stats ────────────────────────────────────── */
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function countUp(el) {
    const target = parseFloat(el.dataset.count);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const isFloat = String(el.dataset.count).includes('.');
    if (reduced) { el.textContent = prefix + el.dataset.count + suffix; return; }
    const dur = 1400, start = performance.now();
    function frame(now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = isFloat ? (target * eased).toFixed(1) : Math.round(target * eased);
      el.textContent = prefix + val + suffix;
      if (p < 1) requestAnimationFrame(frame);
      else el.textContent = prefix + el.dataset.count + suffix;
    }
    requestAnimationFrame(frame);
  }

  /* ── Reveal on scroll + trigger count-up ───────────────── */
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        entry.target.querySelectorAll('[data-count]').forEach(countUp);
        if (entry.target.matches('[data-count]')) countUp(entry.target);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.reveal, [data-count]').forEach((el) => io.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('in'));
    document.querySelectorAll('[data-count]').forEach(countUp);
  }

  /* ── Project filters (Work listing page) ───────────────── */
  var chips = document.querySelectorAll('.filters .chip');
  var groups = document.querySelectorAll('.proj-group');
  if (chips.length && groups.length) {
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        chips.forEach(function (c) { c.classList.toggle('active', c === chip); });
        var f = chip.dataset.filter;
        groups.forEach(function (g) {
          g.classList.toggle('hidden-group', f !== 'all' && g.dataset.group !== f);
        });
      });
    });
  }

  /* ── Copy email ────────────────────────────────────────── */
  const copyBtn = document.getElementById('copy-email');
  if (copyBtn && navigator.clipboard) {
    const label = copyBtn.querySelector('.copy-label');
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(copyBtn.dataset.email).then(() => {
        copyBtn.classList.add('copied');
        if (label) label.textContent = 'Copied';
        setTimeout(() => {
          copyBtn.classList.remove('copied');
          if (label) label.textContent = 'Copy';
        }, 1800);
      });
    });
  } else if (copyBtn) {
    copyBtn.style.display = 'none';
  }

  /* ── Scroll to top ─────────────────────────────────────── */
  const toTop = document.getElementById('to-top');
  if (toTop) toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}());
