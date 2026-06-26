(function () {
    'use strict';

    var base = document.querySelector('meta[name="base-path"]');
    var b = base ? base.content : '.';

    function injectNav(opts) {
        var el = document.getElementById('nav-placeholder');
        if (!el) return;

        var activeLink = opts && opts.active || '';

        function cls(name) {
            var isActive = name === activeLink;
            return 'nav-link px-3.5 py-2 text-muted text-sm font-medium rounded-lg transition-colors hover:text-primary hover:bg-accent/10 no-underline' + (isActive ? ' active' : '');
        }

        el.innerHTML =
            '<nav id="navbar" class="fixed inset-x-0 top-0 z-[900] h-[72px] transition-all duration-300 scrolled">' +
                '<div class="max-w-site mx-auto px-6 lg:px-12 h-full flex items-center justify-between">' +
                    '<a href="' + b + '/index.html" class="font-display text-2xl font-bold text-primary tracking-tight no-underline">' +
                        'RK<span class="text-accent">.</span>' +
                    '</a>' +
                    '<ul class="hidden md:flex items-center gap-1 list-none m-0 p-0">' +
                        '<li><a href="' + b + '/index.html#about" class="' + cls('about') + '">About</a></li>' +
                        '<li><a href="' + b + '/index.html#skills" class="' + cls('skills') + '">Skills</a></li>' +
                        '<li><a href="' + b + '/pages/experience.html" class="' + cls('experience') + '">Experience</a></li>' +
                        '<li><a href="' + b + '/pages/projects.html" class="' + cls('projects') + '">Projects</a></li>' +
                        '<li><a href="' + b + '/index.html#contact" class="' + cls('contact') + '">Contact</a></li>' +
                    '</ul>' +
                    '<a href="' + b + '/index.html" class="md:hidden flex items-center gap-2 text-muted text-sm font-medium no-underline hover:text-primary">' +
                        '<i class="fas fa-arrow-left"></i> Back' +
                    '</a>' +
                '</div>' +
            '</nav>';
    }

    function injectFooter() {
        var el = document.getElementById('footer-placeholder');
        if (!el) return;

        el.innerHTML =
            '<footer class="border-t border-accent/[0.22] py-8">' +
                '<div class="max-w-site mx-auto px-6 lg:px-12 flex items-center justify-between flex-wrap gap-4">' +
                    '<p class="text-[0.88rem] text-muted">Designed &amp; Built by <span class="text-accent">Rishikesh Kumar</span></p>' +
                    '<div class="flex gap-[18px]">' +
                        '<a href="https://github.com/Rishikesh-kumar-7258" target="_blank" rel="noopener" class="text-muted text-base no-underline transition-colors hover:text-accent"><i class="fab fa-github"></i></a>' +
                        '<a href="https://www.linkedin.com/in/rishikesh-kumar-profile" target="_blank" rel="noopener" class="text-muted text-base no-underline transition-colors hover:text-accent"><i class="fab fa-linkedin-in"></i></a>' +
                        '<a href="mailto:rishi7258prince@gmail.com" class="text-muted text-base no-underline transition-colors hover:text-accent"><i class="fas fa-envelope"></i></a>' +
                    '</div>' +
                '</div>' +
            '</footer>';
    }

    var navOpts = document.querySelector('meta[name="nav-active"]');
    injectNav(navOpts ? { active: navOpts.content } : {});
    injectFooter();
}());
