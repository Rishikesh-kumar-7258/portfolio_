/* ═══════════════════════════════════════════════════════════
   Shared editorial nav + footer injection for sub-pages.
   Reads <meta name="base-path"> (path back to site root) and
   <meta name="nav-active"> (projects | experience). Run this
   BEFORE editorial.js so the toggle/menu wiring finds the nodes.
   ═══════════════════════════════════════════════════════════ */
(function () {
    'use strict';

    var baseMeta = document.querySelector('meta[name="base-path"]');
    var b = baseMeta ? baseMeta.content : '.';
    var activeMeta = document.querySelector('meta[name="nav-active"]');
    var active = activeMeta ? activeMeta.content : '';

    function navClass(name) { return name === active ? ' class="active"' : ''; }

    var navEl = document.getElementById('nav-placeholder');
    if (navEl) {
        navEl.innerHTML =
            '<nav id="site-nav" class="site-nav scrolled">' +
                '<div class="wrap nav-inner">' +
                    '<a href="' + b + '/index.html" class="brand">Rishikesh Kumar<span class="dot">.</span></a>' +
                    '<ul id="nav-links" class="nav-links">' +
                        '<li><a href="' + b + '/pages/projects.html"' + navClass('projects') + '>Work</a></li>' +
                        '<li><a href="' + b + '/index.html#about">About</a></li>' +
                        '<li><a href="' + b + '/pages/experience.html"' + navClass('experience') + '>Experience</a></li>' +
                        '<li><a href="' + b + '/index.html#skills">Skills</a></li>' +
                        '<li><a href="' + b + '/index.html#contact">Contact</a></li>' +
                    '</ul>' +
                    '<div class="nav-side">' +
                        '<div id="resume-wrap" class="resume-wrap">' +
                            '<button id="resume-btn" class="resume-btn" aria-haspopup="true" aria-expanded="false" aria-controls="resume-menu">' +
                                'Résumé <i class="chev fas fa-chevron-down"></i>' +
                            '</button>' +
                            '<div id="resume-menu" class="resume-menu">' +
                                '<a href="' + b + '/Assets/sde.pdf" target="_blank" rel="noopener"><i class="fas fa-code"></i> SDE / Full Stack</a>' +
                                '<a href="' + b + '/Assets/ml.pdf" target="_blank" rel="noopener"><i class="fas fa-brain"></i> ML / Data Science</a>' +
                            '</div>' +
                        '</div>' +
                        '<button id="theme-toggle" class="theme-toggle" aria-label="Switch theme">' +
                            '<i class="fas fa-moon"></i><i class="fas fa-sun"></i>' +
                        '</button>' +
                        '<button id="menu-btn" class="menu-btn" aria-label="Toggle menu" aria-expanded="false" aria-controls="nav-links">' +
                            '<span></span><span></span><span></span>' +
                        '</button>' +
                    '</div>' +
                '</div>' +
                '<div id="scroll-progress" class="scroll-progress"></div>' +
            '</nav>';
    }

    var footEl = document.getElementById('footer-placeholder');
    if (footEl) {
        footEl.innerHTML =
            '<footer class="site-footer">' +
                '<div class="wrap footer-inner">' +
                    '<p>Designed &amp; built by <span class="accent">Rishikesh Kumar</span> · 2026</p>' +
                    '<div class="footer-socials">' +
                        '<a href="https://github.com/Rishikesh-kumar-7258" target="_blank" rel="noopener" aria-label="GitHub"><i class="fab fa-github"></i></a>' +
                        '<a href="https://www.linkedin.com/in/rishikesh-kumar-profile" target="_blank" rel="noopener" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>' +
                        '<a href="mailto:rishi7258prince@gmail.com" aria-label="Email"><i class="fas fa-envelope"></i></a>' +
                    '</div>' +
                '</div>' +
            '</footer>';
    }
}());
