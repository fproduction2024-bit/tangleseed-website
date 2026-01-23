/* Tangleseed - Main JavaScript */

document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile menu toggle
    const menuToggle = document.querySelector('.header__menu-toggle');
    const nav = document.querySelector('.header__nav');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('header__nav--open');
            this.classList.toggle('header__menu-toggle--active');
        });
    }
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Header background on scroll
    const header = document.querySelector('.header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
        
        lastScroll = currentScroll;
    });
    
    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const animateOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate--visible');
                
                // If it's a number, trigger counting animation
                if (entry.target.classList.contains('social-proof__number')) {
                    startCounting(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Counting animation function
    function startCounting(el) {
        if (el.dataset.counted) return;
        el.dataset.counted = "true";
        
        const target = parseInt(el.innerText.replace(/[^0-9]/g, ''));
        const suffix = el.querySelector('small') ? el.querySelector('small').outerHTML : (el.innerText.includes('+') ? '+' : '');
        let count = 0;
        const duration = 2000; // 2 seconds
        const stepTime = Math.abs(Math.floor(duration / target));
        const startTime = performance.now();
        
        function updateCount(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (outQuad)
            const easedProgress = progress * (2 - progress);
            const currentCount = Math.floor(easedProgress * target);
            
            el.innerHTML = currentCount.toLocaleString() + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(updateCount);
            } else {
                el.innerHTML = target.toLocaleString() + suffix;
            }
        }
        
        requestAnimationFrame(updateCount);
    }
    
    // Observe elements for animation
    document.querySelectorAll('.service-card, .timeline__item, .social-proof__item, .benefit-card, .team-member, .story-card, .section-title, .mission__text, .mission__image, .social-proof__number').forEach((el, index) => {
        el.classList.add('animate--fade-up');
        // Add staggering delay
        el.style.transitionDelay = `${(index % 3) * 0.1}s`;
        animateOnScroll.observe(el);
    });

    // Hero Parallax effect
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroContent = document.querySelector('.hero__content');
        if (heroContent) {
            heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
            heroContent.style.opacity = 1 - (scrolled / 600);
        }
    });
});
