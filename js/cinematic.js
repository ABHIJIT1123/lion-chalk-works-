/**
 * Lion Chalk Works — Cinematic Engine v2.0
 * Particles · Cursor · Progress · Preloader · Transitions
 * Tilt · Scroll Reveals · Counters · Kinetic Type
 * Zero dependencies — pure vanilla JS
 */

(function () {
    'use strict';

    // =========================================
    // 1. CHALK DUST PARTICLE CANVAS
    // =========================================
    function initParticles() {
        const canvas = document.getElementById('hero-particles');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let particles = [];
        let animId;
        let w, h;

        function resize() {
            w = canvas.width = canvas.offsetWidth;
            h = canvas.height = canvas.offsetHeight;
        }

        class Particle {
            constructor() {
                this.reset();
                this.y = Math.random() * h;
            }

            reset() {
                this.x = Math.random() * w;
                this.y = -10;
                this.size = Math.random() * 2.5 + 0.5;
                this.speedY = Math.random() * 0.4 + 0.1;
                this.speedX = (Math.random() - 0.5) * 0.3;
                this.opacity = Math.random() * 0.5 + 0.1;
                this.wobble = Math.random() * Math.PI * 2;
                this.wobbleSpeed = Math.random() * 0.02 + 0.005;
                const brightness = Math.floor(Math.random() * 60 + 180);
                this.color = `rgba(${brightness}, ${brightness - 30}, ${brightness - 60}, `;
            }

            update() {
                this.wobble += this.wobbleSpeed;
                this.x += this.speedX + Math.sin(this.wobble) * 0.3;
                this.y += this.speedY;
                if (this.y > h + 10 || this.x < -10 || this.x > w + 10) {
                    this.reset();
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color + this.opacity + ')';
                ctx.fill();
            }
        }

        function init() {
            resize();
            const count = Math.min(Math.floor((w * h) / 8000), 120);
            particles = [];
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        }

        function animate() {
            ctx.clearRect(0, 0, w, h);
            particles.forEach(p => { p.update(); p.draw(); });
            animId = requestAnimationFrame(animate);
        }

        window.addEventListener('resize', () => {
            cancelAnimationFrame(animId);
            init();
            animate();
        });

        init();
        animate();
    }

    // =========================================
    // 2. SCROLL-TRIGGERED REVEALS
    // =========================================
    function initScrollReveals() {
        const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .divider-line');
        if (!revealElements.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => observer.observe(el));
    }

    // =========================================
    // 3. COUNTER ANIMATIONS
    // =========================================
    function initCounters() {
        const counters = document.querySelectorAll('[data-counter]');
        if (!counters.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(el => observer.observe(el));

        function animateCounter(el) {
            const target = parseFloat(el.getAttribute('data-counter'));
            const suffix = el.getAttribute('data-suffix') || '';
            const prefix = el.getAttribute('data-prefix') || '';
            const decimals = (target % 1 !== 0) ? 1 : 0;
            const duration = 2000;
            const start = performance.now();

            function easeOutExpo(t) {
                return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
            }

            function update(now) {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                const current = easeOutExpo(progress) * target;
                el.textContent = prefix + current.toFixed(decimals) + suffix;
                if (progress < 1) requestAnimationFrame(update);
            }

            requestAnimationFrame(update);
        }
    }

    // =========================================
    // 4. HERO TITLE — LETTER BY LETTER
    // =========================================
    function initKineticTitle() {
        const titles = document.querySelectorAll('.kinetic-title');
        titles.forEach(title => {
            const text = title.textContent.trim();
            title.textContent = '';
            title.setAttribute('aria-label', text);

            const words = text.split(' ');
            words.forEach((word, wordIdx) => {
                const wordSpan = document.createElement('span');
                wordSpan.style.display = 'inline-block';
                wordSpan.style.whiteSpace = 'nowrap';

                [...word].forEach((char, charIdx) => {
                    const span = document.createElement('span');
                    span.classList.add('char');
                    span.textContent = char;
                    const globalIdx = text.indexOf(word) + charIdx;
                    span.style.animationDelay = `${0.8 + globalIdx * 0.04}s`;
                    wordSpan.appendChild(span);
                });

                title.appendChild(wordSpan);

                if (wordIdx < words.length - 1) {
                    const space = document.createElement('span');
                    space.innerHTML = '&nbsp;';
                    space.classList.add('char');
                    space.style.animationDelay = `${0.8 + (text.indexOf(word) + word.length) * 0.04}s`;
                    title.appendChild(space);
                }
            });
        });
    }

    // =========================================
    // 5. NAVBAR — TRANSPARENT → SOLID
    // =========================================
    function initNavbar() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;

        function checkScroll() {
            if (window.scrollY > 80) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        window.addEventListener('scroll', checkScroll, { passive: true });
        checkScroll();
    }

    // =========================================
    // 6. MANIFESTO WORD HIGHLIGHT
    // =========================================
    function initManifesto() {
        const manifestoEls = document.querySelectorAll('.manifesto-text');
        if (!manifestoEls.length) return;

        manifestoEls.forEach(el => {
            const text = el.textContent.trim();
            const words = text.split(/\s+/);
            el.textContent = '';
            words.forEach(word => {
                const span = document.createElement('span');
                span.classList.add('word');
                span.textContent = word + ' ';
                el.appendChild(span);
            });
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const words = entry.target.querySelectorAll('.word');
                    words.forEach((word, i) => {
                        setTimeout(() => word.classList.add('active'), i * 120);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        manifestoEls.forEach(el => observer.observe(el));
    }

    // =========================================
    // 7. PARALLAX IMAGES
    // =========================================
    function initParallax() {
        const parallaxContainers = document.querySelectorAll('.parallax-image-container');
        if (!parallaxContainers.length) return;

        function updateParallax() {
            parallaxContainers.forEach(container => {
                const rect = container.getBoundingClientRect();
                const viewH = window.innerHeight;
                if (rect.top < viewH && rect.bottom > 0) {
                    const progress = (viewH - rect.top) / (viewH + rect.height);
                    const img = container.querySelector('img');
                    if (img) {
                        const shift = (progress - 0.5) * -60;
                        img.style.transform = `translateY(${shift}px)`;
                    }
                }
            });
        }

        window.addEventListener('scroll', updateParallax, { passive: true });
        updateParallax();
    }

    // =========================================
    // 8. SMOOTH SCROLL FOR ANCHOR LINKS
    // =========================================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                if (targetId === '#') return;
                const target = document.querySelector(targetId);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    // =========================================
    // 9. MOBILE MENU — close on link click
    // =========================================
    function initMobileMenu() {
        const checkbox = document.getElementById('mobile-menu-check');
        if (!checkbox) return;
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => { checkbox.checked = false; });
        });
    }

    // =========================================
    // 10. CUSTOM GOLD CURSOR (#1)
    // =========================================
    function initCustomCursor() {
        // Skip on touch devices
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

        const dot = document.createElement('div');
        dot.classList.add('cursor-dot');
        const ring = document.createElement('div');
        ring.classList.add('cursor-ring');
        document.body.appendChild(dot);
        document.body.appendChild(ring);

        let mouseX = -100, mouseY = -100;
        let ringX = -100, ringY = -100;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            dot.style.left = mouseX + 'px';
            dot.style.top = mouseY + 'px';
        });

        // Smooth ring follow
        function animateRing() {
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;
            ring.style.left = ringX + 'px';
            ring.style.top = ringY + 'px';
            requestAnimationFrame(animateRing);
        }
        animateRing();

        // Hover detection
        const hoverTargets = 'a, button, .btn, .product-card, .glass-card, .contact-card, .testimonial-card, .filter-tab, label, input, textarea, select';
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest(hoverTargets)) {
                document.body.classList.add('cursor-hover');
            }
        });
        document.addEventListener('mouseout', (e) => {
            if (e.target.closest(hoverTargets)) {
                document.body.classList.remove('cursor-hover');
            }
        });

        // Hide default cursor
        document.documentElement.style.cursor = 'none';
        document.querySelectorAll('a, button, input, textarea, select, label').forEach(el => {
            el.style.cursor = 'none';
        });
    }

    // =========================================
    // 11. SCROLL PROGRESS BAR (#2)
    // =========================================
    function initScrollProgress() {
        const bar = document.querySelector('.scroll-progress');
        if (!bar) return;

        function updateProgress() {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            bar.style.width = progress + '%';
        }

        window.addEventListener('scroll', updateProgress, { passive: true });
        updateProgress();
    }

    // =========================================
    // 12. PAGE PRELOADER (#3)
    // =========================================
    function initPreloader() {
        const preloader = document.querySelector('.preloader');
        if (!preloader) return;

        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('loaded');
            }, 600);
        });

        // Fallback — hide after 3s no matter what
        setTimeout(() => {
            preloader.classList.add('loaded');
        }, 3000);
    }

    // =========================================
    // 13. SMOOTH PAGE TRANSITIONS (#4)
    // =========================================
    function initPageTransitions() {
        const overlay = document.querySelector('.page-transition-overlay');
        if (!overlay) return;

        document.querySelectorAll('a').forEach(link => {
            const href = link.getAttribute('href');
            // Only internal page links
            if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('https://wa.me')) return;

            link.addEventListener('click', (e) => {
                e.preventDefault();
                overlay.classList.add('active');
                setTimeout(() => {
                    window.location.href = href;
                }, 400);
            });
        });
    }

    // =========================================
    // 14. BACK TO TOP BUTTON (#7)
    // =========================================
    function initBackToTop() {
        const btn = document.querySelector('.back-to-top');
        if (!btn) return;

        function checkVisibility() {
            if (window.scrollY > window.innerHeight) {
                btn.classList.add('visible');
            } else {
                btn.classList.remove('visible');
            }
        }

        window.addEventListener('scroll', checkVisibility, { passive: true });
        checkVisibility();

        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // Also handle footer back-to-top buttons
        document.querySelectorAll('.footer-back-top').forEach(footerBtn => {
            footerBtn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        });
    }

    // =========================================
    // 15. PRODUCT CARD 3D TILT (#8)
    // =========================================
    function initCardTilt() {
        if ('ontouchstart' in window) return; // skip on mobile

        const cards = document.querySelectorAll('.product-card');
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -5;
                const rotateY = ((x - centerX) / centerX) * 5;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            });
        });
    }

    // =========================================
    // 16. LAZY VIDEO (#15)
    // =========================================
    function initLazyVideo() {
        const video = document.querySelector('.hero-video');
        if (!video) return;

        // Pause video when not in viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    video.play().catch(() => {});
                } else {
                    video.pause();
                }
            });
        }, { threshold: 0.1 });

        observer.observe(video);
    }

    // =========================================
    // INIT ALL
    // =========================================
    function init() {
        // Core
        initPreloader();
        initParticles();
        initKineticTitle();
        initScrollReveals();
        initCounters();
        initNavbar();
        initManifesto();
        initParallax();
        initSmoothScroll();
        initMobileMenu();

        // Perfection upgrades
        initCustomCursor();
        initScrollProgress();
        initPageTransitions();
        initBackToTop();
        initCardTilt();
        initLazyVideo();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
