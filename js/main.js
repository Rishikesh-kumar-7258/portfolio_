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

    document.querySelectorAll('.nav-link, .nav-resume').forEach((link) => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('open');
            navMenu.classList.remove('open');
        });
    });

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
            'Full Stack Engineer',
            'ML Engineer',
            'Data Scientist',
            'M.Tech @ IIT Bombay',
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

    // ── GSAP scroll-reveal ────────────────────────────────────────────────────
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
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
