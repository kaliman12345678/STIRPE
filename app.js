/* ==========================================================================
   STIRPE — app.js
   Interacciones: navbar scroll, menú móvil, modales, formulario, animaciones, banner cookies
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // 1. NAVBAR — Efecto al hacer scroll
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });

    // 2. MENÚ MÓVIL
    const hamburger = document.getElementById('hamburger');
    const navLinks  = document.getElementById('navLinks');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            const isOpen = navLinks.classList.contains('open');
            hamburger.setAttribute('aria-expanded', isOpen);
        });

        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
            });
        });
    }

    // 3. HERO IMAGE PARALLAX SUAVE
    const heroBg = document.querySelector('.hero-bg-img');
    if (heroBg) {
        heroBg.classList.add('loaded');
        window.addEventListener('scroll', () => {
            const y = window.scrollY;
            if (y < window.innerHeight) {
                heroBg.style.transform = `scale(1) translateY(${y * 0.22}px)`;
            }
        }, { passive: true });
    }

    // 4. SCROLL SUAVE PARA ANCLAJES
    document.querySelectorAll('a[href^="#"]:not(.modal-link)').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId && targetId !== '#') {
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    const offset = navbar ? navbar.offsetHeight + 15 : 70;
                    const top = target.getBoundingClientRect().top + window.scrollY - offset;
                    window.scrollTo({ top, behavior: 'smooth' });
                }
            }
        });
    });

    // 5. SISTEMA DE MODALES (Términos & Privacidad)
    const modals     = document.querySelectorAll('.modal');
    const modalLinks = document.querySelectorAll('.modal-link');

    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('open');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeAllModals() {
        modals.forEach(m => {
            m.classList.remove('open');
            m.setAttribute('aria-hidden', 'true');
        });
        document.body.style.overflow = '';
    }

    modalLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const modalId = link.getAttribute('data-modal');
            if (modalId) openModal(modalId);
        });
    });

    modals.forEach(modal => {
        modal.querySelectorAll('.modal-close-trigger, .modal-close-btn').forEach(btn => {
            btn.addEventListener('click', closeAllModals);
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeAllModals();
    });

    // 6. FORMULARIO DE CONTACTO
    const form    = document.getElementById('contactForm');
    const success = document.getElementById('formSuccess');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            btn.disabled = true;
            btn.textContent = 'Enviando...';

            setTimeout(() => {
                form.reset();
                btn.disabled = false;
                btn.textContent = originalText;
                if (success) {
                    success.style.display = 'flex';
                    setTimeout(() => {
                        success.style.display = 'none';
                    }, 5000);
                }
            }, 1000);
        });
    }

    // 7. ANIMACIONES DE ENTRADA SUAVES (Intersection Observer)
    const animatables = document.querySelectorAll('.pillar-card, .split-image-wrap, .light-img-wrap, .legal-card, .btn-legal-big');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity   = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        animatables.forEach(el => {
            el.style.opacity    = '0';
            el.style.transform  = 'translateY(28px)';
            el.style.transition = 'opacity 0.7s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1)';
            const delay = el.getAttribute('data-delay') || 0;
            el.style.transitionDelay = `${delay}ms`;
            observer.observe(el);
        });
    }

    // 8. BANNER DE PRIVACIDAD / COOKIES
    const cookieBanner  = document.getElementById('cookieBanner');
    const cookieAccept  = document.getElementById('cookieAccept');
    const cookieDetails = document.getElementById('cookieDetails');

    if (cookieBanner) {
        const accepted = localStorage.getItem('stirpe_privacy_accepted');
        if (!accepted) {
            cookieBanner.style.display = 'flex';
            setTimeout(() => {
                cookieBanner.classList.remove('hidden');
            }, 800);
        }

        if (cookieAccept) {
            cookieAccept.addEventListener('click', () => {
                localStorage.setItem('stirpe_privacy_accepted', 'true');
                cookieBanner.classList.add('hidden');
                setTimeout(() => {
                    cookieBanner.style.display = 'none';
                }, 400);
            });
        }

        if (cookieDetails) {
            cookieDetails.addEventListener('click', () => {
                openModal('modal-privacidad');
            });
        }
    }

});
