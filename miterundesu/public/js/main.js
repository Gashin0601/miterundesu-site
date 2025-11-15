/**
 * Miterundesu Website - Frontend TypeScript
 * Handles all client-side interactions
 */
// ========================================
// DOM Element Selectors
// ========================================
const hamburgerMenu = document.getElementById('hamburger-menu');
const navMenu = document.getElementById('nav-menu');
const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');
// ========================================
// Hamburger Menu Toggle
// ========================================
function initHamburgerMenu() {
    if (!hamburgerMenu || !navMenu) {
        return;
    }
    hamburgerMenu.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        // Animate hamburger icon
        const spans = hamburgerMenu.querySelectorAll('span');
        if (navMenu.classList.contains('active')) {
            // Transform to X
            if (spans[0])
                spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
            if (spans[1])
                spans[1].style.opacity = '0';
            if (spans[2])
                spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
        }
        else {
            // Transform back to hamburger
            if (spans[0])
                spans[0].style.transform = 'none';
            if (spans[1])
                spans[1].style.opacity = '1';
            if (spans[2])
                spans[2].style.transform = 'none';
        }
    });
    // Close menu when clicking on a nav link
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navMenu.classList.remove('active');
                // Reset hamburger icon
                const spans = hamburgerMenu.querySelectorAll('span');
                if (spans[0])
                    spans[0].style.transform = 'none';
                if (spans[1])
                    spans[1].style.opacity = '1';
                if (spans[2])
                    spans[2].style.transform = 'none';
            }
        });
    });
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        const target = e.target;
        if (!hamburgerMenu.contains(target) && !navMenu.contains(target)) {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                // Reset hamburger icon
                const spans = hamburgerMenu.querySelectorAll('span');
                if (spans[0])
                    spans[0].style.transform = 'none';
                if (spans[1])
                    spans[1].style.opacity = '1';
                if (spans[2])
                    spans[2].style.transform = 'none';
            }
        }
    });
}
// ========================================
// Smooth Scrolling
// ========================================
function initSmoothScrolling() {
    // Get all anchor links that start with #
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            if (!href || href === '#')
                return;
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                // Calculate offset for sticky header
                const headerHeight = document.querySelector('.header')?.clientHeight || 0;
                const targetPosition = targetElement.offsetTop - headerHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}
// ========================================
// Contact Form Handling
// ========================================
function initContactForm() {
    if (!contactForm || !formMessage) {
        return;
    }
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            'inquiry-type': document.getElementById('inquiry-type').value,
            message: document.getElementById('message').value
        };
        // Validate form data
        if (!formData.name || !formData.email || !formData['inquiry-type'] || !formData.message) {
            showFormMessage('すべての必須項目を入力してください。', 'error');
            return;
        }
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            showFormMessage('有効なメールアドレスを入力してください。', 'error');
            return;
        }
        try {
            // Show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = '送信中...';
            // TODO: Phase 3 - Add API endpoint for form submission
            // For now, simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            // Temporary: Log to console (will be replaced with actual API call)
            console.log('Form submitted:', formData);
            // Show success message
            showFormMessage('お問い合わせを受け付けました。2-3営業日以内にご連絡いたします。', 'success');
            // Reset form
            contactForm.reset();
            // Reset submit button
            submitButton.disabled = false;
            submitButton.textContent = originalText || '送信する';
        }
        catch (error) {
            console.error('Form submission error:', error);
            showFormMessage('送信中にエラーが発生しました。もう一度お試しください。', 'error');
            // Reset submit button
            const submitButton = contactForm.querySelector('button[type="submit"]');
            submitButton.disabled = false;
            submitButton.textContent = '送信する';
        }
    });
}
/**
 * Display form message to user
 */
function showFormMessage(message, type) {
    if (!formMessage)
        return;
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    formMessage.style.display = 'block';
    // Scroll to message
    formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    // Auto-hide success messages after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }
}
// ========================================
// Header Scroll Effect
// ========================================
function initHeaderScrollEffect() {
    const header = document.querySelector('.header');
    if (!header)
        return;
    const scrollThreshold = 10;
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        // Add shadow when scrolled
        if (scrollTop > scrollThreshold) {
            header.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.1)';
        }
        else {
            header.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
        }
    });
}
// ========================================
// Intersection Observer for Fade-in Animations
// ========================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    // Observe all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.add('fade-in-target');
        observer.observe(section);
    });
}
// ========================================
// Initialize All Features
// ========================================
function init() {
    console.log('🚀 ミテルンデス - Website Loaded');
    // Initialize all interactive features
    initHamburgerMenu();
    initSmoothScrolling();
    initContactForm();
    initHeaderScrollEffect();
    initScrollAnimations();
    console.log('✅ All features initialized');
}
// ========================================
// Run on DOM Content Loaded
// ========================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
}
else {
    init();
}
// Export for potential use in other modules
export { init, showFormMessage };
//# sourceMappingURL=main.js.map