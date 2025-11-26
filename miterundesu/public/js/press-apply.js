// public/js/press-apply.js
var pressApplyForm = document.getElementById("press-apply-form");
var pressFormMessage = document.getElementById("press-form-message");
function initPressApplyForm() {
  if (!pressApplyForm || !pressFormMessage) {
    return;
  }
  pressApplyForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const organizationNameEl = document.getElementById("organization-name");
    const organizationTypeEl = document.getElementById("organization-type");
    const contactPersonEl = document.getElementById("contact-person");
    const emailEl = document.getElementById("press-email");
    const phoneEl = document.getElementById("press-phone");
    const noteEl = document.getElementById("press-note");
    const organizationName = organizationNameEl?.value.trim() || "";
    const organizationType = organizationTypeEl?.value || "";
    const contactPerson = contactPersonEl?.value.trim() || "";
    const email = emailEl?.value.trim() || "";
    const phone = phoneEl?.value.trim() || "";
    const note = noteEl?.value.trim() || "";
    if (!organizationName) {
      showPressFormMessage("\u7D44\u7E54\u540D\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002", "error");
      organizationNameEl?.focus();
      return;
    }
    if (!organizationType) {
      showPressFormMessage("\u7D44\u7E54\u7A2E\u5225\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044\u3002", "error");
      organizationTypeEl?.focus();
      return;
    }
    if (!contactPerson) {
      showPressFormMessage("\u62C5\u5F53\u8005\u540D\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002", "error");
      contactPersonEl?.focus();
      return;
    }
    if (!email) {
      showPressFormMessage("\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002", "error");
      emailEl?.focus();
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showPressFormMessage("\u6709\u52B9\u306A\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002", "error");
      emailEl?.focus();
      return;
    }
    const formData = {
      organizationName,
      organizationType,
      contactPerson,
      email,
      phone: phone || void 0,
      note: note || void 0
    };
    try {
      const submitButton = pressApplyForm.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent || "\u7533\u3057\u8FBC\u3080";
      submitButton.disabled = true;
      submitButton.textContent = "\u9001\u4FE1\u4E2D...";
      const response = await fetch("/api/press-application", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "\u9001\u4FE1\u306B\u5931\u6557\u3057\u307E\u3057\u305F");
      }
      showPressFormMessage(result.message || "\u7533\u8ACB\u3092\u53D7\u3051\u4ED8\u3051\u307E\u3057\u305F\u3002\n\u78BA\u8A8D\u30E1\u30FC\u30EB\u3092\u304A\u9001\u308A\u3057\u307E\u3057\u305F\u306E\u3067\u3054\u78BA\u8A8D\u304F\u3060\u3055\u3044\u3002\n2\u301C3\u55B6\u696D\u65E5\u4EE5\u5185\u306B\u5BE9\u67FB\u3092\u884C\u3044\u3001\u7D50\u679C\u3092\u30E1\u30FC\u30EB\u306B\u3066\u304A\u77E5\u3089\u305B\u3057\u307E\u3059\u3002", "success");
      pressApplyForm.reset();
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    } catch (error) {
      console.error("Press apply form submission error:", error);
      const errorMessage = error instanceof Error ? error.message : "\u9001\u4FE1\u4E2D\u306B\u30A8\u30E9\u30FC\u304C\u767A\u751F\u3057\u307E\u3057\u305F\u3002\u3082\u3046\u4E00\u5EA6\u304A\u8A66\u3057\u304F\u3060\u3055\u3044\u3002";
      showPressFormMessage(errorMessage, "error");
      const submitButton = pressApplyForm.querySelector('button[type="submit"]');
      submitButton.disabled = false;
      submitButton.textContent = "\u7533\u3057\u8FBC\u3080";
    }
  });
}
function showPressFormMessage(message, type) {
  if (!pressFormMessage)
    return;
  pressFormMessage.textContent = message;
  pressFormMessage.className = `form-message ${type}`;
  pressFormMessage.style.display = "block";
  pressFormMessage.scrollIntoView({ behavior: "smooth", block: "nearest" });
  if (type === "success") {
    setTimeout(() => {
      if (pressFormMessage) {
        pressFormMessage.style.display = "none";
      }
    }, 8e3);
  }
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPressApplyForm);
} else {
  initPressApplyForm();
}
export {
  initPressApplyForm,
  showPressFormMessage
};
//# sourceMappingURL=press-apply.bundle.js.map
