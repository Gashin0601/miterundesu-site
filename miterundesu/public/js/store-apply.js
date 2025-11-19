const storeApplyForm = document.getElementById("store-apply-form");
const storeFormMessage = document.getElementById("store-form-message");
function initStoreApplyForm() {
  if (!storeApplyForm || !storeFormMessage) {
    return;
  }
  storeApplyForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = {
      storeName: document.getElementById("store-name").value,
      industry: document.getElementById("industry").value,
      posterType: document.querySelector('input[name="poster-type"]:checked')?.value || "",
      location: document.getElementById("location").value,
      email: document.getElementById("store-email").value,
      phone: document.getElementById("store-phone").value,
      note: document.getElementById("store-note").value
    };
    if (!formData.storeName || !formData.industry || !formData.posterType) {
      showStoreFormMessage("\u3059\u3079\u3066\u306E\u5FC5\u9808\u9805\u76EE\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002", "error");
      return;
    }
    if (formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        showStoreFormMessage("\u6709\u52B9\u306A\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002", "error");
        return;
      }
    }
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
      showStoreFormMessage(result.message, "success");
      storeApplyForm.reset();
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    } catch (error) {
      console.error("Store apply form submission error:", error);
      showStoreFormMessage("\u9001\u4FE1\u4E2D\u306B\u30A8\u30E9\u30FC\u304C\u767A\u751F\u3057\u307E\u3057\u305F\u3002\u3082\u3046\u4E00\u5EA6\u304A\u8A66\u3057\u304F\u3060\u3055\u3044\u3002", "error");
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
    }, 5e3);
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
