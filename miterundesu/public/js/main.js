// public/js/main.js
var initialHash = window.location.hash;
if (initialHash) {
  history.replaceState(null, "", window.location.pathname + window.location.search);
}
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}
function initHamburgerMenu() {
  const hamburgerMenu = document.getElementById("hamburger-menu");
  const navMenu = document.getElementById("nav-menu");
  if (!hamburgerMenu || !navMenu) {
    return;
  }
  let scrollPosition = 0;
  hamburgerMenu.addEventListener("click", (e) => {
    e.stopPropagation();
    const isActive = navMenu.classList.toggle("active");
    hamburgerMenu.classList.toggle("active", isActive);
    hamburgerMenu.setAttribute("aria-expanded", isActive.toString());
    if (isActive) {
      scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollPosition}px`;
      document.body.style.width = "100%";
    } else {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollPosition);
    }
  });
  const closeMenu = () => {
    navMenu.classList.remove("active");
    hamburgerMenu.classList.remove("active");
    hamburgerMenu.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";
    window.scrollTo(0, scrollPosition);
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };
  const navLinks = navMenu.querySelectorAll("a");
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
      link.style.backgroundColor = "";
      link.blur();
    });
  });
  document.addEventListener("click", (e) => {
    const target = e.target;
    if (!hamburgerMenu.contains(target) && !navMenu.contains(target)) {
      if (navMenu.classList.contains("active")) {
        closeMenu();
      }
    }
  });
}
function initSmoothScrolling() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const href = link.getAttribute("href");
      if (!href || href === "#")
        return;
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        const header = document.querySelector(".header");
        const breadcrumb = document.querySelector(".breadcrumb");
        const headerHeight = header ? header.offsetHeight : 0;
        const breadcrumbHeight = breadcrumb ? breadcrumb.offsetHeight : 0;
        const extraPadding = 10;
        const totalOffset = headerHeight + breadcrumbHeight + extraPadding;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - totalOffset;
        window.scrollTo({
          top: targetPosition,
          behavior: "auto"
        });
      }
    });
  });
}
function initInquiryTypeHelper() {
  const inquiryType = document.getElementById("inquiry-type");
  const inquiryHelp = document.getElementById("inquiry-help");
  const messageTextarea = document.getElementById("message");
  if (!inquiryType || !inquiryHelp || !messageTextarea) {
    return;
  }
  const pressFields = document.querySelector(".press-fields");
  const storeFields = document.querySelector(".store-fields");
  const usageFields = document.querySelector(".usage-fields");
  const helpTexts = {
    press: "\u4EE5\u4E0B\u306E\u9805\u76EE\u3092\u3054\u5165\u529B\u304F\u3060\u3055\u3044\u3002\u3088\u308A\u8A73\u7D30\u306A\u60C5\u5831\u306F\u5C02\u7528\u306E\u30D7\u30EC\u30B9\u30E2\u30FC\u30C9\u7533\u8ACB\u30DA\u30FC\u30B8\u3067\u3082\u53D7\u3051\u4ED8\u3051\u3066\u304A\u308A\u307E\u3059\u3002",
    store: "\u4EE5\u4E0B\u306E\u9805\u76EE\u3092\u3054\u5165\u529B\u304F\u3060\u3055\u3044\u3002\u3088\u308A\u8A73\u7D30\u306A\u7533\u3057\u8FBC\u307F\u306F\u5C02\u7528\u306E\u5C0E\u5165\u7533\u3057\u8FBC\u307F\u30DA\u30FC\u30B8\u3067\u3082\u53D7\u3051\u4ED8\u3051\u3066\u304A\u308A\u307E\u3059\u3002",
    usage: "\u30A2\u30D7\u30EA\u306E\u4F7F\u3044\u65B9\u306B\u95A2\u3059\u308B\u8CEA\u554F\u306F\u3001\u3067\u304D\u308B\u3060\u3051\u5177\u4F53\u7684\u306B\u304A\u66F8\u304D\u304F\u3060\u3055\u3044\u3002",
    other: "\u305D\u306E\u4ED6\u306E\u304A\u554F\u3044\u5408\u308F\u305B\u306B\u3064\u3044\u3066\u306F\u3001\u3067\u304D\u308B\u3060\u3051\u8A73\u3057\u304F\u304A\u66F8\u304D\u304F\u3060\u3055\u3044\u3002"
  };
  const placeholders = {
    press: "\u53D6\u6750\u5185\u5BB9\u306E\u8A73\u7D30\u3092\u3054\u8A18\u5165\u304F\u3060\u3055\u3044",
    store: "\u5C0E\u5165\u3092\u691C\u8A0E\u3055\u308C\u3066\u3044\u308B\u7406\u7531\u3084\u3001\u671F\u5F85\u3055\u308C\u308B\u52B9\u679C\u306A\u3069\u3092\u3054\u8A18\u5165\u304F\u3060\u3055\u3044",
    usage: "\u767A\u751F\u3057\u3066\u3044\u308B\u554F\u984C\u3092\u5177\u4F53\u7684\u306B\u3054\u8A18\u5165\u304F\u3060\u3055\u3044",
    other: "\u304A\u554F\u3044\u5408\u308F\u305B\u5185\u5BB9\u3092\u3054\u8A18\u5165\u304F\u3060\u3055\u3044"
  };
  function updateDynamicFields(type) {
    const allDynamicFields = document.querySelectorAll(".dynamic-fields");
    allDynamicFields.forEach((container) => {
      container.style.display = "none";
      container.querySelectorAll("input, select, textarea").forEach((input) => {
        input.removeAttribute("required");
      });
    });
    if (type === "press" && pressFields) {
      pressFields.style.display = "block";
      const mediaName = document.getElementById("media-name");
      const pressDuration = document.getElementById("press-duration");
      if (mediaName)
        mediaName.setAttribute("required", "required");
      if (pressDuration)
        pressDuration.setAttribute("required", "required");
    } else if (type === "store" && storeFields) {
      storeFields.style.display = "block";
      const storeName = document.getElementById("store-name");
      const industry = document.getElementById("industry");
      if (storeName)
        storeName.setAttribute("required", "required");
      if (industry)
        industry.setAttribute("required", "required");
    } else if (type === "usage" && usageFields) {
      usageFields.style.display = "block";
    }
    if (type && helpTexts[type]) {
      if (inquiryHelp) {
        inquiryHelp.textContent = helpTexts[type];
        inquiryHelp.style.display = "block";
      }
      if (messageTextarea) {
        messageTextarea.placeholder = placeholders[type] || "\u304A\u554F\u3044\u5408\u308F\u305B\u5185\u5BB9\u3092\u3054\u8A18\u5165\u304F\u3060\u3055\u3044";
      }
    } else {
      if (inquiryHelp) {
        inquiryHelp.style.display = "none";
      }
      if (messageTextarea) {
        messageTextarea.placeholder = "\u304A\u554F\u3044\u5408\u308F\u305B\u5185\u5BB9\u3092\u3054\u8A18\u5165\u304F\u3060\u3055\u3044";
      }
    }
  }
  inquiryType.addEventListener("change", () => {
    updateDynamicFields(inquiryType.value);
  });
  updateDynamicFields(inquiryType.value);
}
function initContactForm() {
  const contactForm = document.getElementById("contact-form");
  const formMessage = document.getElementById("form-message");
  if (!contactForm || !formMessage) {
    return;
  }
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nameEl = document.getElementById("name");
    const emailEl = document.getElementById("email");
    const inquiryTypeEl = document.getElementById("inquiry-type");
    const messageEl = document.getElementById("message");
    const name = nameEl?.value.trim() || "";
    const email = emailEl?.value.trim() || "";
    const inquiryType = inquiryTypeEl?.value || "";
    let message = messageEl?.value.trim() || "";
    if (inquiryType === "usage") {
      const deviceInfo = document.getElementById("device-info")?.value.trim() || "";
      const errorMessage = document.getElementById("error-message")?.value.trim() || "";
      if (deviceInfo || errorMessage) {
        message += "\n\n--- \u8FFD\u52A0\u60C5\u5831 ---";
        if (deviceInfo)
          message += `
\u7AEF\u672B\u60C5\u5831: ${deviceInfo}`;
        if (errorMessage)
          message += `
\u30A8\u30E9\u30FC\u30E1\u30C3\u30BB\u30FC\u30B8: ${errorMessage}`;
      }
    } else if (inquiryType === "press") {
      const mediaName = document.getElementById("media-name")?.value.trim() || "";
      const position = document.getElementById("position")?.value.trim() || "";
      const pressPhone = document.getElementById("press-phone")?.value.trim() || "";
      const publishDate = document.getElementById("publish-date")?.value || "";
      const pressDuration = document.getElementById("press-duration")?.value || "";
      if (mediaName || position || pressPhone || publishDate || pressDuration) {
        message += "\n\n--- \u53D6\u6750\u60C5\u5831 ---";
        if (mediaName)
          message += `
\u5A92\u4F53\u540D: ${mediaName}`;
        if (position)
          message += `
\u5F79\u8077\u30FB\u90E8\u7F72: ${position}`;
        if (pressPhone)
          message += `
\u96FB\u8A71\u756A\u53F7: ${pressPhone}`;
        if (publishDate)
          message += `
\u63B2\u8F09\u4E88\u5B9A\u65E5: ${publishDate}`;
        if (pressDuration)
          message += `
\u30D7\u30EC\u30B9\u30E2\u30FC\u30C9\u5229\u7528\u671F\u9593: ${pressDuration}`;
      }
    } else if (inquiryType === "store") {
      const storeName = document.getElementById("store-name")?.value.trim() || "";
      const industry = document.getElementById("industry")?.value || "";
      const location = document.getElementById("location")?.value.trim() || "";
      const storePhone = document.getElementById("store-phone")?.value.trim() || "";
      const posterType = document.querySelector('input[name="poster-type"]:checked')?.value || "";
      if (storeName || industry || location || storePhone || posterType) {
        message += "\n\n--- \u5E97\u8217\u60C5\u5831 ---";
        if (storeName)
          message += `
\u5E97\u8217\u30FB\u65BD\u8A2D\u540D: ${storeName}`;
        if (industry)
          message += `
\u696D\u7A2E: ${industry}`;
        if (location)
          message += `
\u6240\u5728\u5730: ${location}`;
        if (storePhone)
          message += `
\u96FB\u8A71\u756A\u53F7: ${storePhone}`;
        if (posterType)
          message += `
\u30DD\u30B9\u30BF\u30FC\u7A2E\u985E: ${posterType === "green" ? "\u30B0\u30EA\u30FC\u30F3\uFF08\u901A\u5E38\u30E2\u30FC\u30C9\uFF09" : "\u30AA\u30EC\u30F3\u30B8\uFF08\u30B7\u30A2\u30BF\u30FC\u30E2\u30FC\u30C9\uFF09"}`;
      }
    }
    if (!name) {
      showFormMessage("\u304A\u540D\u524D\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002", "error");
      nameEl?.focus();
      return;
    }
    if (!email) {
      showFormMessage("\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002", "error");
      emailEl?.focus();
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showFormMessage("\u6709\u52B9\u306A\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002", "error");
      emailEl?.focus();
      return;
    }
    if (!inquiryType) {
      showFormMessage("\u304A\u554F\u3044\u5408\u308F\u305B\u7A2E\u985E\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044\u3002", "error");
      inquiryTypeEl?.focus();
      return;
    }
    if (!message) {
      showFormMessage("\u304A\u554F\u3044\u5408\u308F\u305B\u5185\u5BB9\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002", "error");
      messageEl?.focus();
      return;
    }
    try {
      const submitButton = contactForm.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;
      submitButton.disabled = true;
      submitButton.textContent = "\u9001\u4FE1\u4E2D...";
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
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
        throw new Error(result.error || "\u9001\u4FE1\u306B\u5931\u6557\u3057\u307E\u3057\u305F");
      }
      showFormMessage("\u304A\u554F\u3044\u5408\u308F\u305B\u3092\u53D7\u3051\u4ED8\u3051\u307E\u3057\u305F\u3002\n\u78BA\u8A8D\u30E1\u30FC\u30EB\u3092\u304A\u9001\u308A\u3057\u307E\u3057\u305F\u306E\u3067\u3054\u78BA\u8A8D\u304F\u3060\u3055\u3044\u3002\n2-3\u55B6\u696D\u65E5\u4EE5\u5185\u306B\u62C5\u5F53\u8005\u3088\u308A\u3054\u9023\u7D61\u3044\u305F\u3057\u307E\u3059\u3002", "success");
      contactForm.reset();
      submitButton.disabled = false;
      submitButton.textContent = originalText || "\u9001\u4FE1\u3059\u308B";
    } catch (error) {
      console.error("Form submission error:", error);
      const errorMessage = error instanceof Error ? error.message : "\u9001\u4FE1\u4E2D\u306B\u30A8\u30E9\u30FC\u304C\u767A\u751F\u3057\u307E\u3057\u305F\u3002\u3082\u3046\u4E00\u5EA6\u304A\u8A66\u3057\u304F\u3060\u3055\u3044\u3002";
      showFormMessage(errorMessage, "error");
      const submitButton = contactForm.querySelector('button[type="submit"]');
      submitButton.disabled = false;
      submitButton.textContent = "\u9001\u4FE1\u3059\u308B";
    }
  });
}
function showFormMessage(message, type) {
  const formMessage = document.getElementById("form-message");
  if (!formMessage)
    return;
  formMessage.textContent = message;
  formMessage.className = `form-message ${type}`;
  formMessage.style.display = "block";
  formMessage.scrollIntoView({ behavior: "smooth", block: "nearest" });
  if (type === "success") {
    setTimeout(() => {
      formMessage.style.display = "none";
    }, 8e3);
  }
}
function handleInitialHash() {
  if (initialHash) {
    const targetId = initialHash.substring(1);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      setTimeout(() => {
        const header = document.querySelector(".header");
        const breadcrumb = document.querySelector(".breadcrumb");
        const headerHeight = header ? header.offsetHeight : 0;
        const breadcrumbHeight = breadcrumb ? breadcrumb.offsetHeight : 0;
        const extraPadding = 10;
        const totalOffset = headerHeight + breadcrumbHeight + extraPadding;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - totalOffset;
        window.scrollTo({
          top: targetPosition,
          behavior: "auto"
        });
      }, 100);
    }
  }
}
function init() {
  initHamburgerMenu();
  initSmoothScrolling();
  initInquiryTypeHelper();
  initContactForm();
  initExpandableMenu();
  initBreadcrumb();
  handleInitialHash();
}
function initExpandableMenu() {
  const expandableItems = document.querySelectorAll(".menu-item-expandable");
  expandableItems.forEach((item) => {
    const button = item.querySelector("button");
    if (!button)
      return;
    const submenu = item.querySelector(".submenu");
    if (submenu) {
      const submenuId = `submenu-${Math.random().toString(36).substr(2, 9)}`;
      submenu.id = submenuId;
      button.setAttribute("aria-expanded", "false");
      button.setAttribute("aria-controls", submenuId);
    }
    button.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (window.getSelection) {
        window.getSelection()?.removeAllRanges();
      }
      const isExpanded = item.classList.contains("expanded");
      expandableItems.forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.classList.remove("expanded");
          const otherButton = otherItem.querySelector("button");
          if (otherButton) {
            otherButton.setAttribute("aria-expanded", "false");
          }
        }
      });
      item.classList.toggle("expanded");
      button.setAttribute("aria-expanded", (!isExpanded).toString());
      button.blur();
    });
    button.addEventListener("touchend", () => {
      setTimeout(() => {
        button.blur();
      }, 50);
    }, { passive: true });
  });
}
function initBreadcrumb() {
  const breadcrumbMap = {
    "/press": [
      { label: "\u30C8\u30C3\u30D7", url: "/" },
      { label: "\u30E1\u30C7\u30A3\u30A2\u306E\u65B9\u3078", url: null }
    ],
    "/stores": [
      { label: "\u30C8\u30C3\u30D7", url: "/" },
      { label: "\u5E97\u8217\u30FB\u65BD\u8A2D", url: null }
    ],
    "/stores/apply": [
      { label: "\u30C8\u30C3\u30D7", url: "/" },
      { label: "\u5E97\u8217\u30FB\u65BD\u8A2D", url: "/stores" },
      { label: "\u5C0E\u5165\u7533\u3057\u8FBC\u307F", url: null }
    ],
    "/privacy": [
      { label: "\u30C8\u30C3\u30D7", url: "/" },
      { label: "\u30D7\u30E9\u30A4\u30D0\u30B7\u30FC\u30DD\u30EA\u30B7\u30FC", url: null }
    ],
    "/terms": [
      { label: "\u30C8\u30C3\u30D7", url: "/" },
      { label: "\u5229\u7528\u898F\u7D04", url: null }
    ],
    "/news": [
      { label: "\u30C8\u30C3\u30D7", url: "/" },
      { label: "\u30CB\u30E5\u30FC\u30B9\u4E00\u89A7", url: null }
    ]
  };
  let currentPath = window.location.pathname;
  currentPath = currentPath.replace(/\/index\.html$/, "");
  if (currentPath !== "/" && currentPath.endsWith("/")) {
    currentPath = currentPath.slice(0, -1);
  }
  if (!currentPath) {
    currentPath = "/";
  }
  if (currentPath.startsWith("/news/")) {
    breadcrumbMap[currentPath] = [
      { label: "\u30C8\u30C3\u30D7", url: "/" },
      { label: "\u30CB\u30E5\u30FC\u30B9", url: "/#news" },
      { label: "\u304A\u77E5\u3089\u305B\u8A73\u7D30", url: null }
    ];
  }
  const breadcrumbData = breadcrumbMap[currentPath];
  if (!breadcrumbData) {
    console.log("No breadcrumb data for path:", currentPath);
    return;
  }
  console.log("Initializing breadcrumb for path:", currentPath);
  document.body.classList.add("subpage");
  let breadcrumb = document.querySelector(".breadcrumb");
  if (!breadcrumb) {
    breadcrumb = document.createElement("nav");
    breadcrumb.className = "breadcrumb";
    breadcrumb.setAttribute("aria-label", "\u30D1\u30F3\u304F\u305A\u30EA\u30B9\u30C8");
    const container = document.createElement("div");
    container.className = "breadcrumb-container";
    const list2 = document.createElement("ol");
    list2.className = "breadcrumb-list";
    container.appendChild(list2);
    breadcrumb.appendChild(container);
    const header = document.querySelector(".header");
    if (header) {
      const isDesktop = window.innerWidth > 768;
      if (isDesktop) {
        const logo = header.querySelector(".header-logo");
        if (logo) {
          logo.after(breadcrumb);
        } else {
          const headerContainer = header.querySelector(".header-container");
          if (headerContainer) {
            headerContainer.appendChild(breadcrumb);
          } else {
            header.appendChild(breadcrumb);
          }
        }
      } else {
        header.after(breadcrumb);
      }
    }
  }
  const list = breadcrumb.querySelector(".breadcrumb-list");
  if (!list)
    return;
  list.innerHTML = "";
  breadcrumbData.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = "breadcrumb-item";
    if (index === breadcrumbData.length - 1) {
      li.classList.add("active");
      li.textContent = item.label;
    } else {
      const link = document.createElement("a");
      link.href = item.url;
      link.textContent = item.label;
      li.appendChild(link);
    }
    list.appendChild(li);
    if (index < breadcrumbData.length - 1) {
      const separator = document.createElement("span");
      separator.className = "breadcrumb-separator";
      separator.textContent = ">";
      list.appendChild(separator);
    }
  });
  let scrollTimer;
  window.addEventListener("scroll", () => {
    if (scrollTimer !== void 0) {
      window.clearTimeout(scrollTimer);
    }
    if (window.scrollY > 10) {
      breadcrumb?.classList.add("scrolled");
    } else {
      breadcrumb?.classList.remove("scrolled");
    }
    scrollTimer = window.setTimeout(() => {
      scrollTimer = void 0;
    }, 100);
  }, { passive: true });
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
export {
  init,
  showFormMessage
};
//# sourceMappingURL=main.bundle.js.map
