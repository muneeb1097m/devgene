document.addEventListener('DOMContentLoaded', () => {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    // Custom Cursor
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        gsap.to(cursor, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.1,
            ease: 'power2.out'
        });
    });

    // Hero Animations
    const heroTl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.5 }});
    
    heroTl.from('.hero-bg-img', { scale: 1.2, opacity: 0, duration: 2.5 })
          .from('.hero-tag', { opacity: 0, x: -50, duration: 1 }, '-=1.5')
          .from('.hero h1', { opacity: 0, stagger: 0.2 }, '-=1.2')
          .from('.hero p', { opacity: 0 }, '-=1')
          .from('.hero-actions', { opacity: 0 }, '-=1');

    // Parallax Hero
    gsap.to('.hero-bg-img', {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        }
    });

    ScrollTrigger.refresh();

    // Robust Section Animations
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        const cards = section.querySelectorAll('.glass-card');
        const heading = section.querySelector('h2');

        if (cards.length > 0) {
            gsap.from(cards, {
                scrollTrigger: {
                    trigger: section,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power2.out',
                clearProps: 'all'
            });
        }

        if (heading) {
            gsap.from(heading, {
                scrollTrigger: {
                    trigger: section,
                    start: 'top 90%',
                    toggleActions: 'play none none none'
                },
                opacity: 0,
                duration: 1,
                ease: 'power3.out',
                clearProps: 'all'
            });
        }
    });

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        item.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other items
            faqItems.forEach(i => i.classList.remove('active'));
            
            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // Logo hover effect
    const logo = document.querySelector('.logo');
    logo.addEventListener('mouseenter', () => {
        gsap.to('.logo-icon', { scale: 1.2, backgroundColor: '#fff', color: '#000', duration: 0.4, ease: 'power2.out' });
    });
    logo.addEventListener('mouseleave', () => {
        gsap.to('.logo-icon', { scale: 1, backgroundColor: '#00F3FF', color: '#000', duration: 0.4, ease: 'power2.out' });
    });
});
