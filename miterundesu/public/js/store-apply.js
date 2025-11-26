// public/js/store-apply.js
var storeApplyForm = document.getElementById("store-apply-form");
var storeFormMessage = document.getElementById("store-form-message");
function initStoreApplyForm() {
  if (!storeApplyForm || !storeFormMessage) {
    return;
  }
  storeApplyForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const storeNameEl = document.getElementById("store-name");
    const industryEl = document.getElementById("industry");
    const posterTypeEl = document.querySelector('input[name="poster-type"]:checked');
    const locationEl = document.getElementById("location");
    const emailEl = document.getElementById("store-email");
    const phoneEl = document.getElementById("store-phone");
    const noteEl = document.getElementById("store-note");
    const storeName = storeNameEl?.value.trim() || "";
    const industry = industryEl?.value || "";
    const posterType = posterTypeEl?.value || "";
    const location = locationEl?.value.trim() || "";
    const email = emailEl?.value.trim() || "";
    const phone = phoneEl?.value.trim() || "";
    const note = noteEl?.value.trim() || "";
    if (!storeName) {
      showStoreFormMessage("\u5E97\u8217\u30FB\u65BD\u8A2D\u540D\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002", "error");
      storeNameEl?.focus();
      return;
    }
    if (!industry) {
      showStoreFormMessage("\u696D\u7A2E\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044\u3002", "error");
      industryEl?.focus();
      return;
    }
    if (!posterType) {
      showStoreFormMessage("\u30DD\u30B9\u30BF\u30FC\u7A2E\u985E\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044\u3002", "error");
      const firstRadio = document.getElementById("poster-green");
      firstRadio?.focus();
      return;
    }
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showStoreFormMessage("\u6709\u52B9\u306A\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002", "error");
        emailEl?.focus();
        return;
      }
    }
    const formData = {
      storeName,
      industry,
      posterType,
      location: location || void 0,
      email: email || void 0,
      phone: phone || void 0,
      note: note || void 0
    };
    try {
      const submitButton = storeApplyForm.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent || "\u9001\u4FE1\u3059\u308B";
      submitButton.disabled = true;
      submitButton.textContent = "\u9001\u4FE1\u4E2D...";
      const response = await fetch("/api/store-application", {
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
      showStoreFormMessage(result.message || "\u3054\u9023\u7D61\u3042\u308A\u304C\u3068\u3046\u3054\u3056\u3044\u307E\u3059\uFF01\n\u78BA\u8A8D\u30E1\u30FC\u30EB\u3092\u304A\u9001\u308A\u3057\u307E\u3057\u305F\u306E\u3067\u3054\u78BA\u8A8D\u304F\u3060\u3055\u3044\u3002\n2\u301C3\u55B6\u696D\u65E5\u4EE5\u5185\u306B\u62C5\u5F53\u8005\u3088\u308A\u3054\u9023\u7D61\u3055\u305B\u3066\u3044\u305F\u3060\u304D\u307E\u3059\u3002", "success");
      storeApplyForm.reset();
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    } catch (error) {
      console.error("Store apply form submission error:", error);
      const errorMessage = error instanceof Error ? error.message : "\u9001\u4FE1\u4E2D\u306B\u30A8\u30E9\u30FC\u304C\u767A\u751F\u3057\u307E\u3057\u305F\u3002\u3082\u3046\u4E00\u5EA6\u304A\u8A66\u3057\u304F\u3060\u3055\u3044\u3002";
      showStoreFormMessage(errorMessage, "error");
      const submitButton = storeApplyForm.querySelector('button[type="submit"]');
      submitButton.disabled = false;
      submitButton.textContent = "\u9001\u4FE1\u3059\u308B";
    }
  });
}
function showStoreFormMessage(message, type) {
  if (!storeFormMessage)
    return;
  storeFormMessage.textContent = message;
  storeFormMessage.className = `form-message ${type}`;
  storeFormMessage.style.display = "block";
  storeFormMessage.scrollIntoView({ behavior: "smooth", block: "nearest" });
  if (type === "success") {
    setTimeout(() => {
      if (storeFormMessage) {
        storeFormMessage.style.display = "none";
      }
    }, 8e3);
  }
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initStoreApplyForm);
} else {
  initStoreApplyForm();
}
export {
  initStoreApplyForm,
  showStoreFormMessage
};
//# sourceMappingURL=store-apply.bundle.js.map
