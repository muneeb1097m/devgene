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

    // Form Submission Handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;
            submitBtn.innerText = 'SENDING...';
            submitBtn.disabled = true;

            const formData = new FormData(contactForm);
            const eventId = 'lead_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                studio: formData.get('studio'),
                engine: formData.get('engine'),
                eventId: eventId
            };

            // 1. Browser-side Pixel Lead Event
            if (typeof fbq !== 'undefined') {
                fbq('track', 'Lead', {
                    content_name: 'Strategy Call Request',
                    content_category: 'Contact',
                    value: 0,
                    currency: 'USD'
                }, { eventID: eventId });
            }

            // 2. Server-side CAPI Event
            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });

                if (response.ok) {
                    submitBtn.innerText = 'SUCCESS!';
                    submitBtn.style.backgroundColor = '#00ff88';
                    submitBtn.style.color = '#000';
                    contactForm.reset();
                    
                    setTimeout(() => {
                        submitBtn.innerText = originalText;
                        submitBtn.disabled = false;
                        submitBtn.style.backgroundColor = '';
                        submitBtn.style.color = '';
                    }, 5000);
                } else {
                    throw new Error('Failed to send');
                }
            } catch (error) {
                console.error('Submission error:', error);
                submitBtn.innerText = 'ERROR. TRY AGAIN.';
                submitBtn.style.backgroundColor = '#ff4444';
                
                setTimeout(() => {
                    submitBtn.innerText = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.backgroundColor = '';
                }, 3000);
            }
        });
    }
});
