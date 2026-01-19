/* =====================================================
   Brujordet Snekker - Main JavaScript
   ===================================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initMobileMenu();
    initSmoothScroll();
    initHeaderScroll();
    initContactForm();
    initProjectFilter();
    initLazyLoading();
});

/* =====================================================
   Mobile Menu
   ===================================================== */

function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const body = document.body;

    if (!menuToggle || !mobileNav) return;

    menuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        mobileNav.classList.toggle('active');
        body.classList.toggle('menu-open');
    });

    // Close menu when clicking on a link
    const mobileLinks = mobileNav.querySelectorAll('.mobile-nav-link');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            mobileNav.classList.remove('active');
            body.classList.remove('menu-open');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!menuToggle.contains(e.target) && !mobileNav.contains(e.target)) {
            menuToggle.classList.remove('active');
            mobileNav.classList.remove('active');
            body.classList.remove('menu-open');
        }
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
            menuToggle.classList.remove('active');
            mobileNav.classList.remove('active');
            body.classList.remove('menu-open');
        }
    });
}

/* =====================================================
   Smooth Scroll
   ===================================================== */

function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Skip if just "#"
            if (href === '#') return;

            const target = document.querySelector(href);

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
}

/* =====================================================
   Header Scroll Effect
   ===================================================== */

function initHeaderScroll() {
    const header = document.querySelector('.header');

    if (!header) return;

    let lastScroll = 0;
    const scrollThreshold = 100;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        // Add shadow on scroll
        if (currentScroll > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Hide/show header on scroll (optional - commented out)
        /*
        if (currentScroll > lastScroll && currentScroll > scrollThreshold) {
            header.classList.add('hidden');
        } else {
            header.classList.remove('hidden');
        }
        */

        lastScroll = currentScroll;
    });
}

/* =====================================================
   Contact Form
   ===================================================== */

function initContactForm() {
    const form = document.getElementById('contact-form');

    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        const messageDiv = document.querySelector('.form-message');

        // Validate form
        if (!validateForm(form)) {
            return;
        }

        // Show loading state
        submitBtn.textContent = 'Sender...';
        submitBtn.disabled = true;

        // Collect form data
        const formData = {
            name: form.querySelector('#name').value,
            email: form.querySelector('#email').value,
            phone: form.querySelector('#phone').value,
            location: form.querySelector('#location')?.value || '',
            projectType: form.querySelector('#project-type').value,
            timing: form.querySelector('#timing').value,
            description: form.querySelector('#description').value,
            wantSiteVisit: form.querySelector('#site-visit')?.checked || false
        };

        try {
            // Simulate API call (replace with actual Resend API integration)
            await simulateFormSubmission(formData);

            // Show success message
            showFormMessage(messageDiv, 'success',
                'Takk for henvendelsen! Jeg har mottatt meldingen din og tar kontakt så snart som mulig - vanligvis innen én dag.'
            );

            // Reset form
            form.reset();

        } catch (error) {
            // Show error message
            showFormMessage(messageDiv, 'error',
                'Beklager, noe gikk galt. Prøv igjen eller ring meg direkte.'
            );
            console.error('Form submission error:', error);
        } finally {
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });

    // Real-time validation
    const inputs = form.querySelectorAll('.form-control');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });

        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
}

function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });

    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    let isValid = true;

    // Remove existing error state
    field.classList.remove('error');

    // Required check
    if (field.required && !value) {
        isValid = false;
    }

    // Email validation
    if (type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
        }
    }

    // Phone validation (Norwegian format)
    if (type === 'tel' && value) {
        const phoneRegex = /^(\+47)?[\s-]?[0-9]{3}[\s-]?[0-9]{2}[\s-]?[0-9]{3}$|^[0-9]{8}$/;
        if (!phoneRegex.test(value.replace(/\s/g, ''))) {
            isValid = false;
        }
    }

    if (!isValid) {
        field.classList.add('error');
    }

    return isValid;
}

function showFormMessage(messageDiv, type, text) {
    if (!messageDiv) return;

    messageDiv.textContent = text;
    messageDiv.className = `form-message ${type} show`;

    // Scroll to message
    messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Auto-hide success message after 10 seconds
    if (type === 'success') {
        setTimeout(() => {
            messageDiv.classList.remove('show');
        }, 10000);
    }
}

async function simulateFormSubmission(data) {
    // Simulate network delay
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // For demo purposes, always succeed
            // In production, this would be an actual API call to Resend
            console.log('Form data:', data);
            resolve({ success: true });
        }, 1500);
    });
}

/* =====================================================
   Resend API Integration (Production)
   ===================================================== */

/*
async function submitToResend(formData) {
    const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return response.json();
}
*/

/* =====================================================
   Project Filter (Projects Page)
   ===================================================== */

function initProjectFilter() {
    const filterBtns = document.querySelectorAll('.category-btn');
    const projects = document.querySelectorAll('.project-card');

    if (!filterBtns.length || !projects.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.dataset.category;

            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Filter projects
            projects.forEach(project => {
                const projectCategory = project.dataset.category;

                if (category === 'all' || projectCategory === category) {
                    project.style.display = 'block';
                    fadeIn(project);
                } else {
                    fadeOut(project, () => {
                        project.style.display = 'none';
                    });
                }
            });
        });
    });
}

function fadeIn(element) {
    element.style.opacity = '0';
    element.style.transition = 'opacity 0.3s ease';

    requestAnimationFrame(() => {
        element.style.opacity = '1';
    });
}

function fadeOut(element, callback) {
    element.style.opacity = '1';
    element.style.transition = 'opacity 0.3s ease';

    requestAnimationFrame(() => {
        element.style.opacity = '0';
    });

    setTimeout(callback, 300);
}

/* =====================================================
   Lazy Loading Images
   ===================================================== */

function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');

    if (!lazyImages.length) return;

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px'
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
}

/* =====================================================
   Form Field Error Styles (add to CSS or here)
   ===================================================== */

const errorStyles = document.createElement('style');
errorStyles.textContent = `
    .form-control.error {
        border-color: var(--color-error);
        background-color: #FFF5F5;
    }

    .form-control.error:focus {
        border-color: var(--color-error);
        box-shadow: 0 0 0 3px rgba(211, 47, 47, 0.1);
    }
`;
document.head.appendChild(errorStyles);

/* =====================================================
   Utility Functions
   ===================================================== */

// Debounce function for scroll/resize events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Format phone number (Norwegian)
function formatPhoneNumber(phone) {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 8) {
        return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5)}`;
    }
    return phone;
}

/* =====================================================
   Analytics Helper (Google Analytics / Plausible)
   ===================================================== */

function trackEvent(category, action, label) {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            event_category: category,
            event_label: label
        });
    }

    // Plausible Analytics
    if (typeof plausible !== 'undefined') {
        plausible(action, { props: { category, label } });
    }
}

// Track CTA clicks
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const label = this.textContent.trim();
        trackEvent('CTA', 'click', label);
    });
});

// Track phone clicks
document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', function() {
        trackEvent('Contact', 'phone_click', this.href);
    });
});

// Track email clicks
document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
    link.addEventListener('click', function() {
        trackEvent('Contact', 'email_click', this.href);
    });
});
