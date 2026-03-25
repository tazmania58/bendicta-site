/* ============================================
   BENDICTA CERVEJA — Main JavaScript
   ============================================ */

(function () {
    'use strict';

    // ---- Age Gate ----
    const ageGate = document.getElementById('age-gate');
    const ageYes = document.getElementById('age-yes');
    const ageNo = document.getElementById('age-no');

    if (sessionStorage.getItem('bendicta-age-verified')) {
        ageGate.classList.add('hidden');
    } else {
        document.body.classList.add('no-scroll');
    }

    ageYes.addEventListener('click', () => {
        sessionStorage.setItem('bendicta-age-verified', 'true');
        ageGate.classList.add('hidden');
        document.body.classList.remove('no-scroll');
    });

    ageNo.addEventListener('click', () => {
        window.location.href = 'https://www.google.com';
    });

    // ---- Preloader ----
    window.addEventListener('load', () => {
        setTimeout(() => {
            document.getElementById('preloader').classList.add('loaded');
        }, 800);
    });

    // ---- Custom Cursor ----
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        let mouseX = 0, mouseY = 0;
        let outlineX = 0, outlineY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.left = mouseX + 'px';
            cursorDot.style.top = mouseY + 'px';
        });

        function animateCursor() {
            outlineX += (mouseX - outlineX) * 0.12;
            outlineY += (mouseY - outlineY) * 0.12;
            cursorOutline.style.left = outlineX + 'px';
            cursorOutline.style.top = outlineY + 'px';
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Hover effect on interactive elements
        const hoverTargets = document.querySelectorAll('a, button, .glass-card, .btn, input, textarea, select');
        hoverTargets.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });
    }

    // ---- Navbar ----
    const navbar = document.getElementById('navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    // Scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScroll = scrollY;
    });

    // Mobile toggle
    navToggle.addEventListener('click', () => {
        const isOpen = navToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
        navToggle.setAttribute('aria-expanded', isOpen);
        navToggle.setAttribute('aria-label', isOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
        mobileMenu.setAttribute('aria-hidden', !isOpen);
    });

    // Close mobile menu on link click
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.classList.remove('no-scroll');
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.setAttribute('aria-label', 'Abrir menu de navegação');
            mobileMenu.setAttribute('aria-hidden', 'true');
        });
    });

    // Active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    function updateActiveNav() {
        const scrollY = window.scrollY + 200;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollY >= top && scrollY < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-section') === id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    window.addEventListener('scroll', updateActiveNav);

    // ---- Smooth scroll for anchor links ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (href && /^#[a-zA-Z0-9_-]+$/.test(href)) {
                const target = document.getElementById(href.substring(1));
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // ---- Scroll Reveal ----
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    const ornaments = document.querySelectorAll('.section-ornament-top');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
    ornaments.forEach(el => revealObserver.observe(el));

    // ---- Sensory Meter Fill ----
    const meters = document.querySelectorAll('.meter-fill');
    const meterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const value = entry.target.getAttribute('data-value');
                entry.target.style.setProperty('--meter-width', value + '%');
                entry.target.classList.add('animated');
                meterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    meters.forEach(m => meterObserver.observe(m));

    // ---- Card mouse glow effect ----
    document.querySelectorAll('.glass-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            card.style.setProperty('--mouse-x', x + '%');
            card.style.setProperty('--mouse-y', y + '%');
        });
    });

    // ---- Hero parallax ----
    const heroContent = document.querySelector('.hero-content');
    const floatingElements = document.querySelector('.floating-elements');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const heroHeight = window.innerHeight;
        if (scrollY < heroHeight) {
            const progress = scrollY / heroHeight;
            heroContent.style.transform = `translateY(${scrollY * 0.3}px)`;
            heroContent.style.opacity = 1 - progress * 1.2;
            if (floatingElements) {
                floatingElements.style.transform = `translateY(${scrollY * 0.15}px)`;
            }
        }
    });

    // ---- Bubbles Canvas ----
    const canvas = document.getElementById('bubbles-canvas');
    const ctx = canvas.getContext('2d');

    let bubbles = [];
    let canvasW, canvasH;

    function resizeCanvas() {
        canvasW = canvas.width = window.innerWidth;
        canvasH = canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Bubble {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvasW;
            this.y = canvasH + Math.random() * 100;
            this.radius = Math.random() * 3 + 1;
            this.speed = Math.random() * 0.5 + 0.2;
            this.opacity = Math.random() * 0.3 + 0.05;
            this.wobble = Math.random() * Math.PI * 2;
            this.wobbleSpeed = Math.random() * 0.02 + 0.005;
            this.wobbleAmount = Math.random() * 30 + 10;
        }

        update() {
            this.y -= this.speed;
            this.wobble += this.wobbleSpeed;
            this.x += Math.sin(this.wobble) * 0.3;

            if (this.y < -20) {
                this.reset();
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(178, 143, 62, ${this.opacity})`;
            ctx.fill();

            // Highlight
            ctx.beginPath();
            ctx.arc(this.x - this.radius * 0.3, this.y - this.radius * 0.3, this.radius * 0.3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(218, 185, 98, ${this.opacity * 0.5})`;
            ctx.fill();
        }
    }

    // Create bubbles
    const bubbleCount = Math.min(60, Math.floor(canvasW / 25));
    for (let i = 0; i < bubbleCount; i++) {
        const b = new Bubble();
        b.y = Math.random() * canvasH;
        bubbles.push(b);
    }

    function animateBubbles() {
        ctx.clearRect(0, 0, canvasW, canvasH);
        bubbles.forEach(b => {
            b.update();
            b.draw();
        });
        requestAnimationFrame(animateBubbles);
    }
    animateBubbles();

    // ---- Contact Form ----
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Honeypot check - bots fill hidden fields
            const honeypot = contactForm.querySelector('input[name="website"]');
            if (honeypot && honeypot.value) {
                return; // Bot detected, silently reject
            }

            // Basic client-side sanitization
            const nome = contactForm.querySelector('#nome').value.trim();
            const email = contactForm.querySelector('#email').value.trim();
            const mensagem = contactForm.querySelector('#mensagem').value.trim();

            if (!nome || !email || !mensagem) return;
            if (nome.length > 100 || email.length > 254 || mensagem.length > 2000) return;

            // Show success message (backend integration needed for actual sending)
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.querySelector('.btn-text').textContent;
            btn.querySelector('.btn-text').textContent = 'Mensagem Enviada!';
            btn.style.pointerEvents = 'none';
            btn.style.opacity = '0.7';

            setTimeout(() => {
                btn.querySelector('.btn-text').textContent = originalText;
                btn.style.pointerEvents = '';
                btn.style.opacity = '';
                contactForm.reset();
            }, 3000);
        });
    }

    // ---- Mouse parallax on floating elements ----
    if (window.matchMedia('(hover: hover)').matches) {
        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 2;
            const y = (e.clientY / window.innerHeight - 0.5) * 2;

            document.querySelectorAll('.floating-hop').forEach((el, i) => {
                const depth = (i + 1) * 8;
                el.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
            });

            document.querySelectorAll('.floating-grain').forEach((el, i) => {
                const depth = (i + 1) * 5;
                el.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
            });

            document.querySelectorAll('.floating-bubble').forEach((el, i) => {
                const depth = (i + 1) * 3;
                el.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
            });
        });
    }

})();
