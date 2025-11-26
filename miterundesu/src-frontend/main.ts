/**
 * Miterundesu Website - Frontend TypeScript
 * Handles all client-side interactions
 */

// ========================================
// Prevent Browser Auto-Scroll (Run Immediately)
// ========================================
// Save hash before removing it to handle navigation from subpages
const initialHash = window.location.hash;

// Remove hash IMMEDIATELY to prevent browser from scrolling to hash
if (initialHash) {
  history.replaceState(null, '', window.location.pathname + window.location.search);
}

// Disable browser scroll restoration immediately
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
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

  // Variable to store scroll position
  let scrollPosition = 0;

  hamburgerMenu.addEventListener('click', (e: MouseEvent) => {
    e.stopPropagation();

    const isActive = navMenu.classList.toggle('active');
    hamburgerMenu.classList.toggle('active', isActive);

    // Update ARIA state for screen readers
    hamburgerMenu.setAttribute('aria-expanded', isActive.toString());

    if (isActive) {
      // Opening menu - save current scroll position and lock scroll
      scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPosition}px`;
      document.body.style.width = '100%';
    } else {
      // Closing menu - unlock scroll and restore scroll position
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollPosition);
    }
  });

  // Helper function to close menu
  const closeMenu = () => {
    navMenu.classList.remove('active');
    hamburgerMenu.classList.remove('active');

    // Update ARIA state for screen readers
    hamburgerMenu.setAttribute('aria-expanded', 'false');

    // Unlock scroll and restore scroll position
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo(0, scrollPosition);

    // Force remove all focus
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  // Close menu when clicking on a nav link
  const navLinks = navMenu.querySelectorAll('a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
      // Force remove any visual states
      (link as HTMLElement).style.backgroundColor = '';
      (link as HTMLElement).blur();
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e: MouseEvent) => {
    const target = e.target as Node;
    if (!hamburgerMenu.contains(target) && !navMenu.contains(target)) {
      if (navMenu.classList.contains('active')) {
        closeMenu();
      }
    }
  });
}

// ========================================
// Instant Scrolling (No Smooth Scroll)
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
        // Dynamically calculate offset for sticky header and breadcrumb
        const header = document.querySelector('.header') as HTMLElement;
        const breadcrumb = document.querySelector('.breadcrumb') as HTMLElement;

        // Get computed height including padding and border
        const headerHeight = header ? header.offsetHeight : 0;
        const breadcrumbHeight = breadcrumb ? breadcrumb.offsetHeight : 0;

        // Small padding to ensure the title is clearly visible
        const extraPadding = 10;

        // Calculate total offset
        const totalOffset = headerHeight + breadcrumbHeight + extraPadding;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - totalOffset;

        // Instant scroll without smooth behavior
        window.scrollTo({
          top: targetPosition,
          behavior: 'auto'
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

    // Get form elements
    const nameEl = document.getElementById('name') as HTMLInputElement | null;
    const emailEl = document.getElementById('email') as HTMLInputElement | null;
    const inquiryTypeEl = document.getElementById('inquiry-type') as HTMLSelectElement | null;
    const messageEl = document.getElementById('message') as HTMLTextAreaElement | null;

    // Get form data
    const name = nameEl?.value.trim() || '';
    const email = emailEl?.value.trim() || '';
    const inquiryType = inquiryTypeEl?.value || '';
    const message = messageEl?.value.trim() || '';

    // Validate required fields with specific messages
    if (!name) {
      showFormMessage('お名前を入力してください。', 'error');
      nameEl?.focus();
      return;
    }

    if (!email) {
      showFormMessage('メールアドレスを入力してください。', 'error');
      emailEl?.focus();
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showFormMessage('有効なメールアドレスを入力してください。', 'error');
      emailEl?.focus();
      return;
    }

    if (!inquiryType) {
      showFormMessage('お問い合わせ種類を選択してください。', 'error');
      inquiryTypeEl?.focus();
      return;
    }

    if (!message) {
      showFormMessage('お問い合わせ内容を入力してください。', 'error');
      messageEl?.focus();
      return;
    }

    try {
      // Show loading state
      const submitButton = contactForm.querySelector('button[type="submit"]') as HTMLButtonElement;
      const originalText = submitButton.textContent;
      submitButton.disabled = true;
      submitButton.textContent = '送信中...';

      // Call API
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          inquiryType,
          message
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '送信に失敗しました');
      }

      // Show success message with email notification
      showFormMessage('お問い合わせを受け付けました。\n確認メールをお送りしましたのでご確認ください。\n2-3営業日以内に担当者よりご連絡いたします。', 'success');

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
function showFormMessage(message: string, type: 'success' | 'error'): void {
  const formMessage = document.getElementById('form-message') as HTMLElement | null;

  if (!formMessage) return;

  formMessage.textContent = message;
  formMessage.className = `form-message ${type}`;
  formMessage.style.display = 'block';

  // Scroll to message
  formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  // Auto-hide success messages after 8 seconds
  if (type === 'success') {
    setTimeout(() => {
      formMessage.style.display = 'none';
    }, 8000);
  }
}

// ========================================
// Header Scroll Effect
// ========================================
// @ts-ignore - Function kept for potential future use
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
// @ts-ignore - Function kept for potential future use
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
// @ts-ignore - Function kept for potential future use
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

  // Flag to prevent observer from firing until page is fully loaded
  let isInitialized = false;

  // Wait for all images and resources to load before enabling observer
  window.addEventListener('load', () => {
    // Add extra delay after load to ensure everything is settled
    setTimeout(() => {
      isInitialized = true;
    }, 300);
  });

  const observer = new IntersectionObserver((entries) => {
    // Don't update hash until page is fully loaded
    if (!isInitialized) return;

    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.getAttribute('id');
        if (sectionId) {
          setActiveMenuItem(`.nav-menu a[href="#${sectionId}"]`);

          // DISABLED: Hash update to test if this is causing scroll issues
          // if (history.replaceState) {
          //   history.replaceState(null, '', `#${sectionId}`);
          // }
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
// Handle Initial Hash Navigation
// ========================================
function handleInitialHash(): void {
  // If there was a hash when page loaded, scroll to that section
  if (initialHash) {
    const targetId = initialHash.substring(1);
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      // Wait for page to fully render before scrolling
      setTimeout(() => {
        const header = document.querySelector('.header') as HTMLElement;
        const breadcrumb = document.querySelector('.breadcrumb') as HTMLElement;

        const headerHeight = header ? header.offsetHeight : 0;
        const breadcrumbHeight = breadcrumb ? breadcrumb.offsetHeight : 0;
        const extraPadding = 10;

        const totalOffset = headerHeight + breadcrumbHeight + extraPadding;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - totalOffset;

        window.scrollTo({
          top: targetPosition,
          behavior: 'auto'
        });
      }, 100);
    }
  }
}

// ========================================
// Initialize All Features
// ========================================
function init(): void {
  // Initialize all interactive features
  initHamburgerMenu();

  // Re-enable smooth scrolling with dynamic offset calculation
  initSmoothScrolling();

  initInquiryTypeHelper();
  initContactForm();
  initExpandableMenu();
  initBreadcrumb();

  // Handle initial hash navigation from subpages
  handleInitialHash();
}

// ========================================
// Expandable Menu (Dropdown)
// ========================================
function initExpandableMenu() {
  const expandableItems = document.querySelectorAll('.menu-item-expandable');

  expandableItems.forEach(item => {
    const button = item.querySelector('button');
    if (!button) return;

    // Initialize ARIA attributes
    const submenu = item.querySelector('.submenu');
    if (submenu) {
      const submenuId = `submenu-${Math.random().toString(36).substr(2, 9)}`;
      submenu.id = submenuId;
      button.setAttribute('aria-expanded', 'false');
      button.setAttribute('aria-controls', submenuId);
    }

    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      // Prevent text selection
      if (window.getSelection) {
        window.getSelection()?.removeAllRanges();
      }

      const isExpanded = item.classList.contains('expanded');

      // Close other expanded items
      expandableItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('expanded');
          const otherButton = otherItem.querySelector('button');
          if (otherButton) {
            otherButton.setAttribute('aria-expanded', 'false');
          }
        }
      });

      // Toggle current item
      item.classList.toggle('expanded');

      // Update ARIA state
      button.setAttribute('aria-expanded', (!isExpanded).toString());

      // Remove focus from button to prevent visual selection
      button.blur();
    });

    // Remove focus and active state after touch on mobile
    button.addEventListener('touchend', () => {
      setTimeout(() => {
        button.blur();
      }, 50);
    }, { passive: true });
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
    ],
    '/news': [
      { label: 'トップ', url: '/' },
      { label: 'ニュース一覧', url: null }
    ]
  };

  // Normalize path (remove trailing slash except for root)
  let currentPath = window.location.pathname;

  // Remove index.html from path
  currentPath = currentPath.replace(/\/index\.html$/, '');

  // Remove trailing slash except for root
  if (currentPath !== '/' && currentPath.endsWith('/')) {
    currentPath = currentPath.slice(0, -1);
  }

  // Default to root if empty
  if (!currentPath) {
    currentPath = '/';
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

    // Insert breadcrumb: inside header for desktop, after header for mobile
    const header = document.querySelector('.header');
    if (header) {
      const isDesktop = window.innerWidth > 768;
      if (isDesktop) {
        // Desktop: Insert after logo in header
        const logo = header.querySelector('.header-logo');
        if (logo) {
          logo.after(breadcrumb);
        } else {
          const headerContainer = header.querySelector('.header-container');
          if (headerContainer) {
            headerContainer.appendChild(breadcrumb);
          } else {
            header.appendChild(breadcrumb);
          }
        }
      } else {
        // Mobile: Insert after header
        header.after(breadcrumb);
      }
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

  // Add scroll effect for breadcrumb shadow
  let scrollTimer: number | undefined;
  window.addEventListener('scroll', () => {
    if (scrollTimer !== undefined) {
      window.clearTimeout(scrollTimer);
    }

    if (window.scrollY > 10) {
      breadcrumb?.classList.add('scrolled');
    } else {
      breadcrumb?.classList.remove('scrolled');
    }

    // Debounce for performance
    scrollTimer = window.setTimeout(() => {
      scrollTimer = undefined;
    }, 100);
  }, { passive: true });
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
