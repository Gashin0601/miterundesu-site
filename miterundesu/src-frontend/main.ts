/**
 * Miterundesu Website - Frontend TypeScript
 * Handles all client-side interactions
 */

// ========================================
// Type Definitions
// ========================================
interface FormData {
  name: string;
  email: string;
  'inquiry-type': string;
  message: string;
}

// ========================================
// Hamburger Menu Toggle
// ========================================
function initHamburgerMenu(): void {
  const hamburgerMenu = document.getElementById('hamburger-menu') as HTMLButtonElement | null;
  const navMenu = document.getElementById('nav-menu') as HTMLElement | null;

  if (!hamburgerMenu || !navMenu) {
    return;
  }

  hamburgerMenu.addEventListener('click', (e: MouseEvent) => {
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
  document.addEventListener('click', (e: MouseEvent) => {
    const target = e.target as Node;
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
function initSmoothScrolling(): void {
  // Get all anchor links that start with #
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach(link => {
    link.addEventListener('click', (e: Event) => {
      e.preventDefault();

      const href = (link as HTMLAnchorElement).getAttribute('href');
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
function initInquiryTypeHelper(): void {
  const inquiryType = document.getElementById('inquiry-type') as HTMLSelectElement | null;
  const inquiryHelp = document.getElementById('inquiry-help');
  const messageTextarea = document.getElementById('message') as HTMLTextAreaElement | null;

  if (!inquiryType || !inquiryHelp || !messageTextarea) {
    return;
  }

  // Get all dynamic field containers
  const pressFields = document.querySelector('.press-fields') as HTMLElement | null;
  const storeFields = document.querySelector('.store-fields') as HTMLElement | null;
  const usageFields = document.querySelector('.usage-fields') as HTMLElement | null;

  const helpTexts: Record<string, string> = {
    press: '以下の項目をご入力ください。より詳細な情報は専用のプレスモード申請ページでも受け付けております。',
    store: '以下の項目をご入力ください。より詳細な申し込みは専用の導入申し込みページでも受け付けております。',
    usage: 'アプリの使い方に関する質問は、できるだけ具体的にお書きください。',
    other: 'その他のお問い合わせについては、できるだけ詳しくお書きください。'
  };

  const placeholders: Record<string, string> = {
    press: '取材内容の詳細をご記入ください',
    store: '導入を検討されている理由や、期待される効果などをご記入ください',
    usage: '発生している問題を具体的にご記入ください',
    other: 'お問い合わせ内容をご記入ください'
  };

  // Function to show/hide dynamic fields and manage required attributes
  function updateDynamicFields(type: string) {
    // Hide all dynamic fields first
    const allDynamicFields = document.querySelectorAll('.dynamic-fields');
    allDynamicFields.forEach(container => {
      (container as HTMLElement).style.display = 'none';
      // Remove required from all inputs in hidden containers
      container.querySelectorAll('input, select, textarea').forEach(input => {
        (input as HTMLInputElement).removeAttribute('required');
      });
    });

    // Show and set required attributes for selected type
    if (type === 'press' && pressFields) {
      pressFields.style.display = 'block';
      // Set required for press-specific required fields
      const mediaName = document.getElementById('media-name');
      const pressDuration = document.getElementById('press-duration');
      if (mediaName) mediaName.setAttribute('required', 'required');
      if (pressDuration) pressDuration.setAttribute('required', 'required');
    } else if (type === 'store' && storeFields) {
      storeFields.style.display = 'block';
      // Set required for store-specific required fields
      const storeName = document.getElementById('store-name');
      const industry = document.getElementById('industry');
      if (storeName) storeName.setAttribute('required', 'required');
      if (industry) industry.setAttribute('required', 'required');
      // Note: Radio buttons require at least one to be checked, handled by HTML5 validation
    } else if (type === 'usage' && usageFields) {
      usageFields.style.display = 'block';
      // All usage fields are optional
    }

    // Update help text and placeholder
    if (type && helpTexts[type]) {
      if (inquiryHelp) {
        inquiryHelp.textContent = helpTexts[type];
        inquiryHelp.style.display = 'block';
      }
      if (messageTextarea) {
        messageTextarea.placeholder = placeholders[type] || 'お問い合わせ内容をご記入ください';
      }
    } else {
      if (inquiryHelp) {
        inquiryHelp.style.display = 'none';
      }
      if (messageTextarea) {
        messageTextarea.placeholder = 'お問い合わせ内容をご記入ください';
      }
    }
  }

  inquiryType.addEventListener('change', () => {
    updateDynamicFields(inquiryType.value);
  });

  // Initialize on page load
  updateDynamicFields(inquiryType.value);
}

// ========================================
// Contact Form Handling
// ========================================
function initContactForm(): void {
  const contactForm = document.getElementById('contact-form') as HTMLFormElement | null;
  const formMessage = document.getElementById('form-message') as HTMLElement | null;

  if (!contactForm || !formMessage) {
    return;
  }

  contactForm.addEventListener('submit', async (e: Event) => {
    e.preventDefault();

    // Get form data
    const formData: FormData = {
      name: (document.getElementById('name') as HTMLInputElement).value,
      email: (document.getElementById('email') as HTMLInputElement).value,
      'inquiry-type': (document.getElementById('inquiry-type') as HTMLSelectElement).value,
      message: (document.getElementById('message') as HTMLTextAreaElement).value
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
      const submitButton = contactForm.querySelector('button[type="submit"]') as HTMLButtonElement;
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

    } catch (error) {
      console.error('Form submission error:', error);
      showFormMessage('送信中にエラーが発生しました。もう一度お試しください。', 'error');

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
function showFormMessage(message: string, type: 'success' | 'error'): void {
  const formMessage = document.getElementById('form-message') as HTMLElement | null;

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
function initHeaderScrollEffect(): void {
  const header = document.querySelector('.header') as HTMLElement | null;
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
function initScrollAnimations(): void {
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
// Active Menu Item Highlighting
// ========================================
function initActiveMenu() {
  const currentPath = window.location.pathname;
  const currentHash = window.location.hash;

  // Function to set active menu item
  function setActiveMenuItem(selector: string) {
    // Remove all active classes
    document.querySelectorAll('.nav-menu a, .nav-menu button').forEach(item => {
      item.classList.remove('active');
    });

    // Add active class to current item
    const activeItem = document.querySelector(selector);
    if (activeItem) {
      activeItem.classList.add('active');

      // If it's in a submenu, also mark the parent as active
      const parentExpandable = activeItem.closest('.menu-item-expandable');
      if (parentExpandable) {
        const parentButton = parentExpandable.querySelector('button');
        if (parentButton) {
          parentButton.classList.add('active');
          parentExpandable.classList.add('expanded');
        }
      }
    }
  }

  // For subpages, highlight based on current path
  if (currentPath !== '/') {
    if (currentPath.startsWith('/press')) {
      setActiveMenuItem('.nav-menu a[href="/press"], .nav-menu a[href="/#press"]');
    } else if (currentPath.startsWith('/stores')) {
      setActiveMenuItem('.nav-menu a[href="/stores"]');
    } else if (currentPath.startsWith('/privacy')) {
      setActiveMenuItem('.nav-menu a[href="/privacy"]');
    } else if (currentPath.startsWith('/terms')) {
      setActiveMenuItem('.nav-menu a[href="/terms"]');
    } else if (currentPath.startsWith('/news')) {
      setActiveMenuItem('.nav-menu a[href="/#news"]');
    }
    return;
  }

  // For main page, highlight based on scroll position and hash
  const sections = document.querySelectorAll('section[id]');

  // Initial highlight based on hash
  if (currentHash) {
    setActiveMenuItem(`.nav-menu a[href="${currentHash}"]`);
  } else {
    setActiveMenuItem('.nav-menu a[href="#about"]');
  }

  // Update on scroll
  const observerOptions = {
    threshold: 0.3,
    rootMargin: '-20% 0px -60% 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.getAttribute('id');
        if (sectionId) {
          setActiveMenuItem(`.nav-menu a[href="#${sectionId}"]`);

          // Update URL hash without scrolling
          if (history.replaceState) {
            history.replaceState(null, '', `#${sectionId}`);
          }
        }
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));

  // Update on hash change
  window.addEventListener('hashchange', () => {
    const newHash = window.location.hash;
    if (newHash) {
      setActiveMenuItem(`.nav-menu a[href="${newHash}"]`);
    }
  });
}

// ========================================
// Initialize All Features
// ========================================
function init(): void {
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
  initActiveMenu();

  console.log('✅ All features initialized');
}

// ========================================
// Expandable Menu (Dropdown)
// ========================================
function initExpandableMenu() {
  const expandableItems = document.querySelectorAll('.menu-item-expandable');

  expandableItems.forEach(item => {
    const button = item.querySelector('button');
    if (!button) return;

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
  const breadcrumbMap: Record<string, Array<{label: string, url: string | null}>> = {
    '/press': [
      { label: 'トップ', url: '/' },
      { label: 'メディアの方へ', url: null }
    ],
    '/stores': [
      { label: 'トップ', url: '/' },
      { label: '店舗・施設', url: null }
    ],
    '/stores/apply': [
      { label: 'トップ', url: '/' },
      { label: '店舗・施設', url: '/stores' },
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
    if (header) {
      header.after(breadcrumb);
    }
  }

  const list = breadcrumb.querySelector('.breadcrumb-list');
  if (!list) return;

  // Generate breadcrumb items
  list.innerHTML = '';
  breadcrumbData.forEach((item, index) => {
    const li = document.createElement('li');
    li.className = 'breadcrumb-item';

    if (index === breadcrumbData.length - 1) {
      li.classList.add('active');
      li.textContent = item.label;
    } else {
      const link = document.createElement('a');
      link.href = item.url!;
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
} else {
  init();
}

// Export for potential use in other modules
export { init, showFormMessage };
