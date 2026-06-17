(function () {
    'use strict';

    // ── Nav: scroll glass effect ───────────────────────────────────────────────
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });

    // ── Nav: hamburger toggle ─────────────────────────────────────────────────
    const hamburger = document.getElementById('hamburger');
    const navMenu   = document.getElementById('nav-menu');

    hamburger.addEventListener('click', () => {
        const open = hamburger.classList.toggle('open');
        navMenu.classList.toggle('open', open);
    });

    document.querySelectorAll('.nav-link, .resume-dropdown a').forEach((link) => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('open');
            navMenu.classList.remove('open');
        });
    });

    // ── Nav: resume dropdown (click toggle — hover alone fails on touch) ──────
    const resumeWrap = document.querySelector('.nav-resume-wrap');
    const resumeBtn  = document.querySelector('.nav-resume');

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
            if (e.key === 'Escape') {
                resumeWrap.classList.remove('open');
                resumeBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // ── Scroll progress bar ───────────────────────────────────────────────────
    const progressBar = document.getElementById('scroll-progress');
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            progressBar.style.width = max > 0 ? `${(window.scrollY / max) * 100}%` : '0%';
        }, { passive: true });
    }

    // ── Active nav link on scroll ─────────────────────────────────────────────
    const sections = Array.from(document.querySelectorAll('section[id]'));
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActive() {
        const mid = window.scrollY + window.innerHeight / 3;
        sections.forEach((sec) => {
            const inView = mid >= sec.offsetTop && mid < sec.offsetTop + sec.offsetHeight;
            const link = document.querySelector(`.nav-link[href="#${sec.id}"]`);
            if (link) link.classList.toggle('active', inView);
        });
    }
    window.addEventListener('scroll', updateActive, { passive: true });

    // ── Typing animation ──────────────────────────────────────────────────────
    const el = document.getElementById('typed-text');
    if (el) {
        const phrases = [
            'Software Development Engineer',
            'ML Engineer',
        ];
        let pi = 0, ci = 0, deleting = false;

        function tick() {
            const phrase = phrases[pi];
            ci += deleting ? -1 : 1;
            el.textContent = phrase.slice(0, ci);

            let delay = deleting ? 55 : 95;
            if (!deleting && ci === phrase.length) { delay = 2200; deleting = true; }
            else if (deleting && ci === 0)          { deleting = false; pi = (pi + 1) % phrases.length; delay = 380; }

            setTimeout(tick, delay);
        }
        setTimeout(tick, 1500);
    }

    // ── Project filter tabs ───────────────────────────────────────────────────
    const filterBtns = document.querySelectorAll('#project-filters .filter-btn');
    const projectGroups = document.querySelectorAll('.project-group');

    filterBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            filterBtns.forEach((b) => b.classList.toggle('active', b === btn));
            const filter = btn.dataset.filter;
            projectGroups.forEach((group) => {
                group.classList.toggle('hidden-group', filter !== 'all' && group.dataset.group !== filter);
            });
            // newly shown cards may still be in their pre-reveal state
            if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
                ScrollTrigger.refresh();
            }
        });
    });

    // ── Copy email to clipboard ───────────────────────────────────────────────
    const copyBtn = document.getElementById('copy-email-btn');
    if (copyBtn && navigator.clipboard) {
        const label = copyBtn.querySelector('.copy-label');
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(copyBtn.dataset.email).then(() => {
                copyBtn.classList.add('copied');
                label.textContent = 'Copied!';
                setTimeout(() => {
                    copyBtn.classList.remove('copied');
                    label.textContent = 'Copy';
                }, 2000);
            });
        });
    } else if (copyBtn) {
        copyBtn.style.display = 'none';
    }

    // ── GSAP scroll-reveal ────────────────────────────────────────────────────
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!reducedMotion && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Generic reveal for any element with class .reveal
        gsap.utils.toArray('.reveal').forEach((el) => {
            gsap.to(el, {
                scrollTrigger: {
                    trigger: el,
                    start: 'top 88%',
                    toggleActions: 'play none none none',
                },
                y: 0,
                opacity: 1,
                duration: 0.85,
                ease: 'power3.out',
            });
        });
    } else {
        // Fallback: just make everything visible if GSAP didn't load
        document.querySelectorAll('.reveal').forEach((el) => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
    }
}());
