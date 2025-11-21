// public/js/press-apply.js
var pressApplyForm = document.getElementById("press-apply-form");
var pressFormMessage = document.getElementById("press-form-message");
function initPressApplyForm() {
  if (!pressApplyForm || !pressFormMessage) {
    return;
  }
  pressApplyForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const userId = document.getElementById("user-id").value.trim();
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("password-confirm").value;
    const organizationName = document.getElementById("organization-name").value.trim();
    const organizationType = document.getElementById("organization-type").value;
    const contactPerson = document.getElementById("contact-person").value.trim();
    const email = document.getElementById("press-email").value.trim();
    const phone = document.getElementById("press-phone").value.trim();
    const note = document.getElementById("press-note").value.trim();
    if (!userId || !password || !passwordConfirm || !organizationName || !organizationType || !contactPerson || !email) {
      showPressFormMessage("\u3059\u3079\u3066\u306E\u5FC5\u9808\u9805\u76EE\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002", "error");
      return;
    }
    const userIdRegex = /^[a-zA-Z0-9\-_]{4,20}$/;
    if (!userIdRegex.test(userId)) {
      showPressFormMessage("\u30E6\u30FC\u30B6\u30FCID\u306F4\u301C20\u6587\u5B57\u306E\u534A\u89D2\u82F1\u6570\u5B57\u3001\u30CF\u30A4\u30D5\u30F3\u3001\u30A2\u30F3\u30C0\u30FC\u30B9\u30B3\u30A2\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002", "error");
      return;
    }
    if (password.length < 8) {
      showPressFormMessage("\u30D1\u30B9\u30EF\u30FC\u30C9\u306F8\u6587\u5B57\u4EE5\u4E0A\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002", "error");
      return;
    }
    if (password !== passwordConfirm) {
      showPressFormMessage("\u30D1\u30B9\u30EF\u30FC\u30C9\u304C\u4E00\u81F4\u3057\u307E\u305B\u3093\u3002", "error");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showPressFormMessage("\u6709\u52B9\u306A\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002", "error");
      return;
    }
    const formData = {
      userId,
      password,
      organizationName,
      organizationType,
      contactName: contactPerson,
      contactEmail: email,
      contactPhone: phone || void 0,
      notes: note || void 0
    };
    try {
      const submitButton = pressApplyForm.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent || "\u7533\u3057\u8FBC\u3080";
      submitButton.disabled = true;
      submitButton.textContent = "\u9001\u4FE1\u4E2D...";
      const response = await fetch("/api/press-account-application", {
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
      showPressFormMessage(result.message || "\u304A\u7533\u3057\u8FBC\u307F\u3042\u308A\u304C\u3068\u3046\u3054\u3056\u3044\u307E\u3059\u3002\u5BE9\u67FB\u5B8C\u4E86\u5F8C\u3001\u30E1\u30FC\u30EB\u306B\u3066\u3054\u9023\u7D61\u3044\u305F\u3057\u307E\u3059\u3002", "success");
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
    }, 5e3);
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
