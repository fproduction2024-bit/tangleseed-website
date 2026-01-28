/* Tangleseed - Main JavaScript */

document.addEventListener('DOMContentLoaded', function () {

    // Mobile menu toggle
    const menuToggle = document.querySelector('.header__menu-toggle');
    const nav = document.querySelector('.header__nav');

    if (menuToggle) {
        menuToggle.addEventListener('click', function () {
            nav.classList.toggle('header__nav--open');
            this.classList.toggle('header__menu-toggle--active');
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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

    window.addEventListener('scroll', function () {
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
    window.addEventListener('scroll', function () {
        const scrolled = window.pageYOffset;
        const heroContent = document.querySelector('.hero__content');
        if (heroContent) {
            heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
            heroContent.style.opacity = 1 - (scrolled / 600);
        }
    });

    // Pattern Library Highlight Logic
    async function loadPatternHighlights() {
        const container = document.getElementById('pattern-preview-container');
        if (!container) return;

        try {
            const response = await fetch('js/data/patterns.json');
            if (!response.ok) throw new Error('Failed to load patterns');

            const patterns = await response.json();

            // Filter patterns that have videos
            const patternsWithVideo = patterns.filter(p => p.youtubeVideoId);

            // Shuffle and pick 3 patterns from the video-enabled set
            const shuffled = patternsWithVideo.sort(() => 0.5 - Math.random());
            const selected = shuffled.slice(0, 3);

            container.innerHTML = ''; // Clear placeholders

            selected.forEach(pattern => {
                const card = document.createElement('article');
                card.className = 'pattern-preview-card';

                // Use YouTube thumbnail for video patterns
                let imgPath = `https://img.youtube.com/vi/${pattern.youtubeVideoId}/mqdefault.jpg`;

                card.innerHTML = `
                    <div class="pattern-preview-card__image">
                        <img src="${imgPath}" alt="${pattern.name}" loading="lazy" onerror="this.src='/images/patterns/placeholder.jpg'; this.onerror=null;">
                        <div class="pattern-preview-card__play-icon" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 48px; height: 48px; background: rgba(0,0,0,0.5); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; opacity: 0.8; transition: opacity 0.3s; pointer-events: none;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                        </div>
                    </div>
                    <div class="pattern-preview-card__content">
                        <h3 class="pattern-preview-card__title">${pattern.nameJa || pattern.name || 'Unknown Pattern'}</h3>
                        <p class="pattern-preview-card__subtitle">${pattern.category ? pattern.category[0].toUpperCase() : 'ZENTANGLE'}</p>
                    </div>
                `;

                // Enhanced clickability - Using /library.html for robust navigation
                card.addEventListener('click', (e) => {
                    e.preventDefault();
                    const slug = pattern.slug || pattern.id;
                    window.location.href = `/library.html?pattern=${slug}`;
                });

                container.appendChild(card);
            });
        } catch (error) {
            console.error('Error loading patterns:', error);
            container.innerHTML = '<p>パターンを読み込めませんでした。</p>';
        }
    }

    loadPatternHighlights();
});

