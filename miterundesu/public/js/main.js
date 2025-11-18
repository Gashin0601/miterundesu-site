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
    hamburgerMenu.addEventListener('click', (e) => {
        e.stopPropagation();
        const isActive = navMenu.classList.toggle('active');
        hamburgerMenu.classList.toggle('active', isActive);
    });
    // Close menu when clicking on a nav link
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navMenu.classList.remove('active');
                hamburgerMenu.classList.remove('active');
            }
        });
    });
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        const target = e.target;
        if (!hamburgerMenu.contains(target) && !navMenu.contains(target)) {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                hamburgerMenu.classList.remove('active');
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
// Inquiry Type Helper
// ========================================
function initInquiryTypeHelper() {
    const inquiryType = document.getElementById('inquiry-type');
    const inquiryHelp = document.getElementById('inquiry-help');
    const messageTextarea = document.getElementById('message');
    if (!inquiryType || !inquiryHelp || !messageTextarea) {
        return;
    }
    const helpTexts = {
        press: '取材・プレス関係のお問い合わせの場合は、専用のプレスモード申請ページをご用意しております。媒体名、取材内容、掲載予定日などをお知らせください。',
        store: '店舗・施設への導入をご検討の場合は、専用の導入申し込みページをご用意しております。店舗名、所在地、導入予定時期などをお知らせください。',
        usage: 'アプリの使い方に関する質問は、できるだけ具体的にお書きください。どの機能を使用中に問題が発生したか、エラーメッセージがあればその内容などをお知らせください。',
        other: 'その他のお問い合わせについては、できるだけ詳しくお書きください。'
    };
    const placeholders = {
        press: '媒体名：\n取材内容：\n掲載予定日：\nプレスモードが必要な理由：',
        store: '店舗名：\n所在地：\n業種：\n導入予定時期：\n導入を検討されている理由：',
        usage: '発生している問題：\n使用中の機能：\nエラーメッセージ（あれば）：\n端末情報（iOSバージョンなど）：',
        other: 'お問い合わせ内容をご記入ください'
    };
    inquiryType.addEventListener('change', () => {
        const selectedType = inquiryType.value;
        if (selectedType && helpTexts[selectedType]) {
            inquiryHelp.textContent = helpTexts[selectedType];
            inquiryHelp.style.display = 'block';
            messageTextarea.placeholder = placeholders[selectedType] || 'お問い合わせ内容をご記入ください';
        }
        else {
            inquiryHelp.style.display = 'none';
            messageTextarea.placeholder = 'お問い合わせ内容をご記入ください';
        }
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
    const scrollThreshold = 50;
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        // Add scrolled class when scrolled past threshold
        if (scrollTop > scrollThreshold) {
            header.classList.add('scrolled');
        }
        else {
            header.classList.remove('scrolled');
        }
    }, { passive: true });
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
    initInquiryTypeHelper();
    initContactForm();
    initHeaderScrollEffect();
    initScrollAnimations();
    initExpandableMenu();
    initBreadcrumb();
    console.log('✅ All features initialized');
}
// ========================================
// Expandable Menu (Dropdown)
// ========================================
function initExpandableMenu() {
    const expandableItems = document.querySelectorAll('.menu-item-expandable');
    expandableItems.forEach(item => {
        const button = item.querySelector('button');
        if (!button)
            return;
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            // Close other expanded items
            expandableItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('expanded');
                }
            });
            // Toggle current item
            item.classList.toggle('expanded');
        });
    });
}
// ========================================
// Breadcrumb Navigation
// ========================================
function initBreadcrumb() {
    const breadcrumbMap = {
        '/press': [
            { label: 'トップ', url: '/' },
            { label: 'メディアの方へ', url: null }
        ],
        '/stores': [
            { label: 'トップ', url: '/' },
            { label: '店舗施設', url: null }
        ],
        '/stores/apply': [
            { label: 'トップ', url: '/' },
            { label: '店舗施設', url: '/stores' },
            { label: '導入申し込み', url: null }
        ],
        '/privacy': [
            { label: 'トップ', url: '/' },
            { label: 'プライバシーポリシー', url: null }
        ],
        '/terms': [
            { label: 'トップ', url: '/' },
            { label: '利用規約', url: null }
        ]
    };
    // Normalize path (remove trailing slash except for root)
    let currentPath = window.location.pathname;
    if (currentPath !== '/' && currentPath.endsWith('/')) {
        currentPath = currentPath.slice(0, -1);
    }
    // Handle news pages
    if (currentPath.startsWith('/news/')) {
        breadcrumbMap[currentPath] = [
            { label: 'トップ', url: '/' },
            { label: 'ニュース', url: '/#news' },
            { label: 'お知らせ詳細', url: null }
        ];
    }
    const breadcrumbData = breadcrumbMap[currentPath];
    if (!breadcrumbData) {
        console.log('No breadcrumb data for path:', currentPath);
        return;
    }
    console.log('Initializing breadcrumb for path:', currentPath);
    // Add subpage class to body
    document.body.classList.add('subpage');
    // Find or create breadcrumb container
    let breadcrumb = document.querySelector('.breadcrumb');
    if (!breadcrumb) {
        breadcrumb = document.createElement('nav');
        breadcrumb.className = 'breadcrumb';
        breadcrumb.setAttribute('aria-label', 'パンくずリスト');
        const container = document.createElement('div');
        container.className = 'breadcrumb-container';
        const list = document.createElement('ol');
        list.className = 'breadcrumb-list';
        container.appendChild(list);
        breadcrumb.appendChild(container);
        // Insert after header
        const header = document.querySelector('.header');
        if (header && header.nextSibling) {
            header.parentNode.insertBefore(breadcrumb, header.nextSibling);
        }
    }
    const list = breadcrumb.querySelector('.breadcrumb-list');
    if (!list)
        return;
    // Generate breadcrumb items
    list.innerHTML = '';
    breadcrumbData.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = 'breadcrumb-item';
        if (index === breadcrumbData.length - 1) {
            li.classList.add('active');
            li.textContent = item.label;
        }
        else {
            const link = document.createElement('a');
            link.href = item.url;
            link.textContent = item.label;
            li.appendChild(link);
        }
        list.appendChild(li);
        // Add separator (except for last item)
        if (index < breadcrumbData.length - 1) {
            const separator = document.createElement('span');
            separator.className = 'breadcrumb-separator';
            separator.textContent = '>';
            list.appendChild(separator);
        }
    });
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