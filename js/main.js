(function () {
    'use strict';

    // ── Nav: scroll glass effect ───────────────────────────────────────────────
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        }, { passive: true });
    }

    // ── Nav: hamburger toggle ─────────────────────────────────────────────────
    const hamburger = document.getElementById('hamburger');
    const navMenu   = document.getElementById('nav-menu');

    if (hamburger && navMenu) {
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
    }

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

    function updateActive() {
        const mid = window.scrollY + window.innerHeight / 3;
        sections.forEach((sec) => {
            const inView = mid >= sec.offsetTop && mid < sec.offsetTop + sec.offsetHeight;
            const link = document.querySelector('.nav-link[href="#' + sec.id + '"]');
            if (link) link.classList.toggle('active', inView);
        });
    }
    if (sections.length) {
        window.addEventListener('scroll', updateActive, { passive: true });
    }

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

    // ── Cursor glow effect ────────────────────────────────────────────────────
    if (window.matchMedia('(hover: hover)').matches) {
        const glow = document.createElement('div');
        glow.className = 'cursor-glow';
        document.body.appendChild(glow);
        document.addEventListener('mousemove', (e) => {
            glow.style.left = e.clientX + 'px';
            glow.style.top = e.clientY + 'px';
        }, { passive: true });
    }

    // ── GSAP scroll animations ───────────────────────────────────────────────
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!reducedMotion && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Staggered card reveals — group by parent grid
        gsap.utils.toArray('.grid').forEach((grid) => {
            var cards = grid.querySelectorAll('.reveal');
            if (!cards.length) return;
            gsap.from(cards, {
                scrollTrigger: { trigger: grid, start: 'top 85%' },
                y: 40, opacity: 0, duration: 0.7,
                stagger: 0.12, ease: 'power3.out',
                onComplete: function() {
                    cards.forEach(function(c) {
                        c.style.opacity = '1';
                        c.style.transform = 'none';
                        c.classList.remove('reveal');
                    });
                }
            });
        });

        // Solo reveals (not inside grids)
        gsap.utils.toArray('.reveal').forEach((el) => {
            if (el.closest('.grid')) return;
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

        // Section heading parallax — slide in from left
        gsap.utils.toArray('section h2').forEach((h2) => {
            gsap.from(h2, {
                scrollTrigger: { trigger: h2, start: 'top 90%' },
                x: -30, opacity: 0, duration: 0.8, ease: 'power2.out',
            });
        });

        // Counter animation for highlight stats
        document.querySelectorAll('[data-count]').forEach((el) => {
            var target = el.dataset.count;
            var prefix = el.dataset.prefix || '';
            var suffix = el.dataset.suffix || '';
            var isFloat = target.includes('.');

            gsap.from(el, {
                scrollTrigger: { trigger: el, start: 'top 90%' },
                textContent: 0,
                duration: 1.5,
                ease: 'power2.out',
                snap: isFloat ? { textContent: 0.1 } : { textContent: 1 },
                onUpdate: function() {
                    var val = isFloat ? parseFloat(el.textContent).toFixed(1) : Math.round(parseFloat(el.textContent));
                    el.textContent = prefix + val + suffix;
                },
                onComplete: function() {
                    el.textContent = prefix + target + suffix;
                }
            });
        });

        // Timeline dot pulse on scroll
        gsap.utils.toArray('.tl-wrap .rounded-full').forEach((dot) => {
            gsap.to(dot, {
                scrollTrigger: { trigger: dot, start: 'top 85%' },
                keyframes: [
                    { boxShadow: '0 0 0 0 rgba(112,66,248,0.5)', duration: 0 },
                    { boxShadow: '0 0 0 12px rgba(112,66,248,0)', duration: 0.6 },
                    { boxShadow: '0 0 12px rgba(112,66,248,0.6)', duration: 0.3 },
                ],
                ease: 'power2.out',
            });
        });

        // Ambient section backgrounds — animate glow position
        document.querySelectorAll('[data-ambient]').forEach((section) => {
            gsap.to(section, {
                '--glow-x': '65%',
                '--glow-y': '35%',
                duration: 10,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
            });
        });
    } else {
        document.querySelectorAll('.reveal').forEach((el) => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
    }
}());
