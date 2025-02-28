// Core elements and config
const elements = {
    menuToggle: document.querySelector('.menu-toggle'),
    navLinks: document.querySelector('.nav-links'),
    header: document.querySelector('.navbar'),
    backToTop: document.getElementById('back-to-top'),
    contactForm: document.getElementById('contact-form'),
    projectsContainer: document.querySelector('.projects-container'),
    projectCards: document.querySelectorAll('.project-card'),
    themeToggle: document.createElement('button')
};

const CONFIG = {
    headerScrollThreshold: 100,
    carouselAutoplayInterval: 5000
};

// Performance optimization constants
const PERFORMANCE_CONFIG = {
    observerThreshold: 0.1,
    observerRootMargin: '50px',
    scrollThrottle: 16,
    resizeDebounce: 250,
    animationDuration: 300
};

// Core initialization
const init = () => {
    elements.themeToggle.className = 'theme-toggle';
    elements.themeToggle.innerHTML = '<i class="fas fa-moon"></i>';

    initAnimations();
    initEventListeners();
    
    document.querySelectorAll('.project-card').forEach(card => {
        card.style.opacity = '1';
        card.style.visibility = 'visible';
    });
    
    updateProjectCards();
    startAutoAdvance();
    initTheme();
    initImageLoading();
    initGridAnimation();
    initMobileFeatures();
    initPremiumTransitions();
    initPageTransitions();
    handleNavigationTransition();
    optimizeMobileTransitions();
    initCertificateAnimations();
    initButtonEffects();
};

// Image loading functionality
const initImageLoading = () => {
    const loadImage = (img) => {
        const dataSrc = img.getAttribute('data-src');
        if (!dataSrc) return;

        const tempImage = new Image();
        tempImage.onload = () => {
            img.src = dataSrc;
            img.classList.remove('loading');
            img.classList.add('loaded');
            img.removeAttribute('data-src');
        };
        tempImage.src = dataSrc;
    };

    const observer = new IntersectionObserver(
        entries => entries.forEach(entry => {
            if (entry.isIntersecting) {
                loadImage(entry.target);
                observer.unobserve(entry.target);
            }
        }), 
        { rootMargin: '50px', threshold: 0.1 }
    );

    document.querySelectorAll('img[data-src]').forEach(img => {
        img.classList.contains('profile-image') ? loadImage(img) : observer.observe(img);
    });
};

// Event listeners initialization
const initEventListeners = () => {
    window.addEventListener('scroll', optimizedScrollHandler, { passive: true });
    window.addEventListener('resize', debounce(updateProjectCards, 250), { passive: true });
    elements.menuToggle?.addEventListener('click', toggleMenu);
    elements.backToTop?.addEventListener('click', scrollToTop);
};

// Typed.js Configuration
new Typed('.typed-text', {
    strings: [
        'Hello, I\'m Y Parthiv Reddy',
        'I\'m a BTech CSE Student',
        'I\'m an AI Enthusiast',
        'I\'m an Entrepreneur'
    ],
    typeSpeed: 50,
    backSpeed: 30,
    backDelay: 1500,
    startDelay: 500,
    loop: true,
    showCursor: true,
    cursorChar: '|',
    autoInsertCss: true,
    fadeOut: true,
    fadeOutClass: 'typed-fade-out',
    fadeOutDelay: 500,
    smartBackspace: true
});

// Utility functions
const debounce = (func, wait) => {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
};

const throttle = (func, limit) => {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// Scroll handling
const handleScroll = () => {
    elements.header.classList.toggle('scrolled', window.scrollY > CONFIG.headerScrollThreshold);
    updateActiveSection();
    handleBackToTop();
};

const optimizedScrollHandler = (() => {
    let ticking = false;
    return () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    };
})();

// Back to top functionality
const handleBackToTop = () => {
    if (!elements.backToTop) return;
    const threshold = window.innerHeight * 0.5;
    elements.backToTop.classList.toggle('visible', window.scrollY > threshold);
};

const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};

// Enhanced mobile menu handling
const toggleMenu = () => {
    const isOpen = elements.menuToggle.classList.toggle('active');
    elements.navLinks.classList.toggle('active');
    elements.menuToggle.setAttribute('aria-expanded', isOpen);
    document.body.classList.toggle('menu-open', isOpen);

    if (isOpen) {
        document.addEventListener('click', closeMenuOnClickOutside);
    } else {
        document.removeEventListener('click', closeMenuOnClickOutside);
    }
};

const closeMenuOnClickOutside = (e) => {
    if (!elements.navLinks.contains(e.target) && !elements.menuToggle.contains(e.target)) {
        elements.menuToggle.classList.remove('active');
        elements.navLinks.classList.remove('active');
        document.body.classList.remove('menu-open');
        document.removeEventListener('click', closeMenuOnClickOutside);
    }
};

elements.navLinks?.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
        elements.menuToggle.classList.remove('active');
        elements.navLinks.classList.remove('active');
        document.body.classList.remove('menu-open');
    }
});

// Remove the old initTouchEvents function and replace with this new one
const initTouchEvents = () => {
    if (!elements.projectsContainer) return;

    let touchStartX = 0;
    let touchEndX = 0;
    let lastTouch = 0;

    elements.projectsContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        lastTouch = Date.now();
    }, { passive: true });

    elements.projectsContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].clientX;
        const touchDuration = Date.now() - lastTouch;
        handleProjectSwipe(touchEndX - touchStartX, touchDuration);
    }, { passive: true });

    const handleProjectSwipe = (diff, duration) => {
        // Only handle quick swipes (less than 300ms)
        if (duration > 300) return;

        const swipeThreshold = window.innerWidth * 0.15; // 15% of screen width
        if (Math.abs(diff) < swipeThreshold) return;

        if (diff > 0) {
            // Swipe right - show previous project
            updateCarousel(-1);
        } else {
            // Swipe left - show next project
            updateCarousel(1);
        }
        startAutoAdvance(); // Reset autoplay timer after manual navigation
    };
};

// Optimize scroll performance on mobile
const optimizeScroll = () => {
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
};

// Initialize mobile-specific features
const initMobileFeatures = () => {
    initTouchEvents();
    optimizeScroll();

    let lastTouchEnd = 0;
    document.addEventListener('touchend', (e) => {
        const now = Date.now();
        if (now - lastTouchEnd < 300) {
            e.preventDefault();
        }
        lastTouchEnd = now;
    }, { passive: false });

    const isMobile = window.innerWidth <= 768;
    
    const splineViewer = document.querySelector('spline-viewer');
    if (splineViewer && isMobile) {
        splineViewer.setAttribute('zoom', '0.7');
        splineViewer.setAttribute('auto-rotate', 'true');
    }

    if (isMobile) {
        const heroGridElements = document.querySelectorAll('.hero-grid-element');
        heroGridElements.forEach((el, index) => {
            if (index > 25) el.remove();
        });

        document.querySelectorAll('[data-aos]').forEach(el => {
            el.setAttribute('data-aos-duration', '600');
        });
    }

    const optimizeHeroForMobile = () => {
        const isMobile = window.innerWidth <= 768;
        const splineViewer = document.querySelector('spline-viewer');
        
        if (splineViewer) {
            if (isMobile) {
                splineViewer.setAttribute('zoom', '0.8');
                splineViewer.setAttribute('auto-rotate', 'true');
                
                if (window.innerHeight > window.innerWidth) {
                    splineViewer.style.transform = 'scale(0.95)';
                } else {
                    splineViewer.style.transform = 'scale(0.85)';
                }
            } else {
                splineViewer.removeAttribute('zoom');
                splineViewer.style.transform = 'none';
            }
        }
    };

    optimizeHeroForMobile();
    window.addEventListener('resize', debounce(optimizeHeroForMobile, 250));
    window.addEventListener('orientationchange', optimizeHeroForMobile);
};

// Project carousel functionality
const updateCarousel = (direction) => {
    const cards = Array.from(elements.projectCards);
    currentIndex = (currentIndex + direction + cards.length) % cards.length;
    updateProjectCards();
};

const updateProjectCards = debounce(() => {
    try {
        const cards = Array.from(elements.projectCards);
        const container = elements.projectsContainer;
        
        if (!cards.length || !container) return;

        cards.forEach(card => {
            card.style.opacity = '1';
            card.style.visibility = 'visible';
        });

        const cardWidth = cards[0]?.offsetWidth || 0;
        const gap = 32;
        const offset = container.parentElement ? 
            (container.parentElement.offsetWidth - cardWidth) / 2 : 0;
        const transform = `translate3d(${-(currentIndex * (cardWidth + gap)) + offset}px, 0, 0)`;

        requestAnimationFrame(() => {
            cards.forEach((card, index) => {
                const isActive = index === currentIndex;
                card.style.transform = isActive ? 'scale(1)' : 'scale(0.9)';
                card.style.opacity = isActive ? '1' : '0.5';
                card.classList.toggle('active', isActive);
            });
            container.style.transform = transform;
            container.style.opacity = '1';
            container.style.visibility = 'visible';
        });
    } catch (error) {
        console.error('Error updating project cards:', error);
    }
}, 16);

let currentIndex = 0;
let autoAdvanceInterval;

const startAutoAdvance = () => {
    clearInterval(autoAdvanceInterval);
    autoAdvanceInterval = setInterval(() => {
        if (!document.hidden) updateCarousel(1);
    }, CONFIG.carouselAutoplayInterval);
};

// Section tracking and smooth scroll
const updateActiveSection = () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let currentSection = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.pageYOffset >= sectionTop) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.toggle('active', 
            link.getAttribute('href') === `#${currentSection}`);
    });
};

// Lightbox functionality
const initLightbox = () => {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.close-lightbox');

    const openLightbox = (imgSrc) => {
        if (!lightbox || !lightboxImg || !imgSrc) return;
        lightboxImg.src = imgSrc;
        lightbox.style.display = 'block';
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        if (!lightbox) return;
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    };

    document.querySelectorAll('img[data-lightbox]').forEach(img => {
        img.addEventListener('click', () => openLightbox(img.getAttribute('data-src') || img.src));
        img.style.cursor = 'pointer';
    });

    closeBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        closeLightbox();
    });

    lightbox?.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
    });
};

// Enhanced event listeners
const initEnhancedEventListeners = () => {
    document.querySelectorAll('.carousel-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            updateCarousel(btn.classList.contains('next-btn') ? 1 : -1);
            startAutoAdvance();
        });
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                elements.menuToggle?.classList.remove('active');
                elements.navLinks?.classList.remove('active');
            }
        });
    });

    elements.contactForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Message sent successfully!');
        e.target.reset();
    });
};

// Initialize animations
const initAnimations = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '50px'
    });

    document.querySelectorAll('.fade-up, .slide-in, .project-card, .skill-item')
        .forEach(el => observer.observe(el));
};

// Theme handling - Updated to make dark theme primary and not follow device preferences
const initTheme = () => {
    document.querySelector('.navbar').appendChild(elements.themeToggle);
    
    const toggleTheme = () => {
        document.body.classList.toggle('light-theme');
        elements.themeToggle.querySelector('i').className = 
            document.body.classList.contains('light-theme') ? 'fas fa-sun' : 'fas fa-moon';
        localStorage.setItem('theme', 
            document.body.classList.contains('light-theme') ? 'light' : 'dark');
    };

    elements.themeToggle.addEventListener('click', toggleTheme);
    
    // Only change theme if explicitly set to light in localStorage
    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light-theme');
        elements.themeToggle.querySelector('i').className = 'fas fa-sun';
    } else {
        // Ensure dark theme is set as default
        document.body.classList.remove('light-theme');
        localStorage.setItem('theme', 'dark');
        elements.themeToggle.querySelector('i').className = 'fas fa-moon';
    }
};

const initGridAnimation = () => {
    const hero = document.querySelector('.hero');
    const gridPoints = 50;

    for (let i = 0; i < gridPoints; i++) {
        const element = document.createElement('div');
        element.className = 'hero-grid-element';
        
        element.style.left = `${Math.random() * 100}%`;
        element.style.top = `${Math.random() * 100}%`;
        
        element.style.animationDelay = `${Math.random() * 2}s`;
        
        hero.appendChild(element);
    }
};

// Update hero section based on screen size
const updateHeroLayout = () => {
    const isMobile = window.innerWidth <= 768;
    const splineContainer = document.querySelector('.spline-container');
    
    if (isMobile) {
        if (splineContainer) {
            splineContainer.style.transform = 'scale(0.8)';
            splineContainer.style.margin = '0 auto';
        }
    } else {
        if (splineContainer) {
            splineContainer.style.transform = 'none';
            splineContainer.style.margin = '0 -50px 0 0';
        }
    }
};

window.addEventListener('resize', debounce(() => {
    updateHeroLayout();
}, 250));

// Premium transitions initialization
const initPremiumTransitions = () => {
    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    if (entry.target.classList.contains('stagger-children')) {
                        entry.target.querySelectorAll(':scope > *').forEach((child, index) => {
                            setTimeout(() => {
                                child.classList.add('visible');
                            }, index * 100);
                        });
                    }
                }
            });
        },
        {
            threshold: 0.15,
            rootMargin: '0px'
        }
    );

    document.querySelectorAll('.section-transition, .fade-in, .stagger-children')
        .forEach(element => sectionObserver.observe(element));

    const hero = document.querySelector('.hero');
    if (hero) {
        setTimeout(() => {
            hero.classList.add('visible');
        }, 300);
    }

    const projectsObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    document.querySelectorAll('.project-card').forEach((card, index) => {
                        setTimeout(() => {
                            card.classList.add('visible');
                        }, index * 200);
                    });
                    projectsObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.1,
            rootMargin: '50px'
        }
    );

    const projectsSection = document.querySelector('.projects');
    if (projectsSection) {
        projectsObserver.observe(projectsSection);
    }

    const certificationsObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    
                    const cards = entry.target.querySelectorAll('.certificate-card');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.classList.add('visible');
                        }, index * 100);
                    });
                    
                    certificationsObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.1,
            rootMargin: '50px'
        }
    );

    const certificationsSection = document.querySelector('.certifications-achievements');
    if (certificationsSection) {
        certificationsObserver.observe(certificationsSection);
    }
};

// Smooth page transitions
const initPageTransitions = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const currentSection = document.querySelector('.section-active');
                if (currentSection) {
                    currentSection.classList.remove('section-active');
                    currentSection.classList.add('section-exit');
                }

                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                setTimeout(() => {
                    targetElement.classList.add('section-active');
                    targetElement.classList.remove('section-exit');
                }, 300);
            }
        });
    });
};

const createUnifiedTypedConfig = () => ({
    strings: [
        'Hello, I\'m Y Parthiv Reddy',
        'I\'m a BTech CSE Student',
        'I\'m an AI Enthusiast',
        'I\'m an Entrepreneur'
    ],
    typeSpeed: 50,
    backSpeed: 30,
    backDelay: 1500,
    startDelay: 500,
    loop: true,
    showCursor: true,
    cursorChar: '|',
    autoInsertCss: true,
    fadeOut: true,
    fadeOutClass: 'typed-fade-out',
    fadeOutDelay: 500,
    smartBackspace: true,
    onStringTyped: function(arrayPos, self) {
        const typedSpan = document.querySelector('.typed-text span');
        if (typedSpan) {
            typedSpan.style.transform = 'translateY(-2px)';
            setTimeout(() => {
                typedSpan.style.transform = 'translateY(0)';
            }, 100);
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    init();
    initLightbox();
    initEnhancedEventListeners();
    initMobileFeatures();
    updateHeroLayout();
    
    let typed = new Typed('.typed-text', createUnifiedTypedConfig());

    // Update on resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            typed.destroy();
            typed = new Typed('.typed-text', createUnifiedTypedConfig());
        }, 250);
    });

    initPremiumTransitions();
    initPageTransitions();

    document.body.classList.add('loaded');
});

// Handle smooth navigation transitions
const handleNavigationTransition = () => {
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section');

    const observerOptions = {
        threshold: 0.3,
        rootMargin: '-20% 0px -20% 0px'
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentSection = entry.target;
                const sectionId = currentSection.id;

                navLinks.forEach(link => {
                    link.classList.toggle('active',
                        link.getAttribute('href') === `#${sectionId}`);
                });

                currentSection.classList.add('section-active');
            }
        });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));
};

// Optimize transitions for mobile
const optimizeMobileTransitions = () => {
    if (window.innerWidth <= 768) {
        document.querySelectorAll('.stagger-children > *').forEach((el, index) => {
            el.style.transitionDelay = `${index * 0.1}s`;
        });
    }
};

// Initialize certificate animations
const initCertificateAnimations = () => {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.1,
            rootMargin: '50px'
        }
    );

    document.querySelectorAll('.certificate-card').forEach(card => {
        card.style.animationPlayState = 'paused';
        observer.observe(card);
    });
};

// Image optimization
const optimizeImages = () => {
    const imageObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.onload = () => {
                            img.classList.add('loaded');
                            img.removeAttribute('data-src');
                        };
                    }
                    imageObserver.unobserve(img);
                }
            });
        },
        {
            threshold: PERFORMANCE_CONFIG.observerThreshold,
            rootMargin: PERFORMANCE_CONFIG.observerRootMargin
        }
    );

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
};

// Enhanced performance monitoring
const performanceMonitor = {
    marks: {},
    start(id) {
        this.marks[id] = performance.now();
    },
    end(id) {
        if (this.marks[id]) {
            const duration = performance.now() - this.marks[id];
            console.debug(`Performance [${id}]: ${duration.toFixed(2)}ms`);
            delete this.marks[id];
        }
    }
};

// Optimized animation handler
const animationHandler = {
    elements: new Set(),
    observer: null,

    init() {
        this.observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        requestAnimationFrame(() => {
                            entry.target.classList.add('visible');
                            this.observer.unobserve(entry.target);
                        });
                    }
                });
            },
            {
                threshold: PERFORMANCE_CONFIG.observerThreshold,
                rootMargin: PERFORMANCE_CONFIG.observerRootMargin
            }
        );

        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            this.elements.add(el);
            this.observer.observe(el);
        });
    },

    cleanup() {
        this.elements.forEach(el => this.observer.unobserve(el));
        this.elements.clear();
    }
};

// Initialize optimizations
document.addEventListener('DOMContentLoaded', () => {
    performanceMonitor.start('init');

    optimizeImages();
    animationHandler.init();

    window.addEventListener('scroll', optimizedScrollHandler, { passive: true });
    window.addEventListener('resize', debounce(() => {
        updateLayout();
    }, PERFORMANCE_CONFIG.resizeDebounce), { passive: true });

    initIntersectionObservers();

    performanceMonitor.end('init');
});

// Clean up resources
window.addEventListener('unload', () => {
    animationHandler.cleanup();
});

// Mobile Performance Optimizations
const mobileOptimizations = {
    init() {
        if (window.innerWidth <= 768) {
            this.optimizeScrolling();
            this.optimizeImages();
            this.reduceDOMOperations();
            this.optimizeTouchEvents();
        }
    },

    optimizeScrolling() {
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    },

    optimizeImages() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                });
            },
            { rootMargin: '50px' }
        );

        images.forEach(img => imageObserver.observe(img));
    },

    reduceDOMOperations() {
        // Limit number of particles/elements in animations
        const heroGridElements = document.querySelectorAll('.hero-grid-element');
        heroGridElements.forEach((el, index) => {
            if (index > 20) el.remove(); // Reduce number of grid elements
        });

        // Disable heavy animations
        document.body.classList.add('reduce-motion');
    },

    optimizeTouchEvents() {
        let touchStartX = 0;
        let touchEndX = 0;
        const swipeThreshold = 50;

        document.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        document.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        const handleSwipe = () => {
            const diff = touchEndX - touchStartX;
            if (Math.abs(diff) < swipeThreshold) return;

            if (diff > 0) {
                // Swipe right action
                updateCarousel(-1);
            } else {
                // Swipe left action
                updateCarousel(1);
            }
        };
    }
};

// Initialize mobile optimizations
document.addEventListener('DOMContentLoaded', () => {
    mobileOptimizations.init();
    
    // Re-run optimizations on orientation change
    window.addEventListener('orientationchange', () => {
        setTimeout(() => mobileOptimizations.init(), 300);
    });
});

// Initialize button effects
const initButtonEffects = () => {
    const exploreButton = document.querySelector('.explore-button');
    
    if (exploreButton) {
        exploreButton.addEventListener('mouseenter', () => {
            exploreButton.querySelector('i').style.transform = 'translateX(5px) rotate(90deg)';
        });

        exploreButton.addEventListener('mouseleave', () => {
            exploreButton.querySelector('i').style.transform = 'translateX(0) rotate(0)';
        });

        // Add smooth scroll behavior
        exploreButton.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = document.querySelector(exploreButton.getAttribute('href'));
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
};
