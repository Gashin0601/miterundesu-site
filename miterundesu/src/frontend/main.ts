/**
 * Miterundesu Website - Frontend TypeScript
 * Handles all client-side interactions
 */

// ========================================
// DOM Element Selectors
// ========================================
const hamburgerMenu = document.getElementById('hamburger-menu');
const navMenu = document.getElementById('nav-menu');
const contactForm = document.getElementById('contact-form') as HTMLFormElement | null;
const formMessage = document.getElementById('form-message');

// ========================================
// Hamburger Menu Toggle
// ========================================
function initHamburgerMenu() {
  if (!hamburgerMenu || !navMenu) {
    return;
  }

  hamburgerMenu.addEventListener('click', () => {
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
    const target = e.target as HTMLElement;
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
      if (!href || href === '#') return;

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
  const inquiryType = document.getElementById('inquiry-type') as HTMLSelectElement | null;
  const inquiryHelp = document.getElementById('inquiry-help');
  const messageTextarea = document.getElementById('message') as HTMLTextAreaElement | null;

  if (!inquiryType || !inquiryHelp || !messageTextarea) {
    return;
  }

  const helpTexts: Record<string, string> = {
    press: '取材・プレス関係のお問い合わせの場合は、専用のプレスモード申請ページをご用意しております。媒体名、取材内容、掲載予定日などをお知らせください。',
    store: '店舗・施設への導入をご検討の場合は、専用の導入申し込みページをご用意しております。店舗名、所在地、導入予定時期などをお知らせください。',
    usage: 'アプリの使い方に関する質問は、できるだけ具体的にお書きください。どの機能を使用中に問題が発生したか、エラーメッセージがあればその内容などをお知らせください。',
    other: 'その他のお問い合わせについては、できるだけ詳しくお書きください。'
  };

  const placeholders: Record<string, string> = {
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
      messageTextarea.placeholder = placeholders[selectedType];
    } else {
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
      name: (document.getElementById('name') as HTMLInputElement).value,
      email: (document.getElementById('email') as HTMLInputElement).value,
      inquiryType: (document.getElementById('inquiry-type') as HTMLSelectElement).value,
      message: (document.getElementById('message') as HTMLTextAreaElement).value
    };

    // Validate form data
    if (!formData.name || !formData.email || !formData.inquiryType || !formData.message) {
      showFormMessage('すべての必須項目を入力してください。', 'error');
      return;
    }

    // Redirect to specialized forms for press/store inquiries
    if (formData.inquiryType === 'press') {
      const shouldRedirect = confirm(
        'プレス・メディア関係者の方は専用のお申し込みフォームがございます。\n\nプレスモード申請ページに移動しますか？'
      );
      if (shouldRedirect) {
        window.location.href = '/press';
        return;
      }
    }

    if (formData.inquiryType === 'store') {
      const shouldRedirect = confirm(
        '店舗・施設の導入をご検討の方は専用のお申し込みフォームがございます。\n\n店舗導入申し込みページに移動しますか？'
      );
      if (shouldRedirect) {
        window.location.href = '/stores/apply';
        return;
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showFormMessage('有効なメールアドレスを入力してください。', 'error');
      return;
    }

    try {
      // Show loading state
      const submitButton = contactForm.querySelector('button[type="submit"]') as HTMLButtonElement;
      const originalText = submitButton.textContent || '';
      submitButton.disabled = true;
      submitButton.textContent = '送信中...';

      // Submit to API
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '送信に失敗しました');
      }

      // Show success message
      showFormMessage(result.message || 'お問い合わせを受け付けました。2-3営業日以内にご連絡いたします。', 'success');

      // Reset form
      contactForm.reset();

      // Reset submit button
      submitButton.disabled = false;
      submitButton.textContent = originalText || '送信する';

    } catch (error) {
      console.error('Form submission error:', error);
      const errorMessage = error instanceof Error ? error.message : '送信中にエラーが発生しました。もう一度お試しください。';
      showFormMessage(errorMessage, 'error');

      // Reset submit button
      const submitButton = contactForm.querySelector('button[type="submit"]') as HTMLButtonElement;
      submitButton.disabled = false;
      submitButton.textContent = '送信する';
    }
  });
}

/**
 * Display form message to user
 */
function showFormMessage(message: string, type: 'success' | 'error') {
  if (!formMessage) return;

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
  if (!header) return;

  const scrollThreshold = 50;

  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Add scrolled class when scrolled past threshold
    if (scrollTop > scrollThreshold) {
      header.classList.add('scrolled');
    } else {
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

  console.log('✅ All features initialized');
}

// ========================================
// Run on DOM Content Loaded
// ========================================
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Export for potential use in other modules
export { init, showFormMessage };
