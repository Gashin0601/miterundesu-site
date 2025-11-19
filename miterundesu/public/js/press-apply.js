// public/js/press-apply.js
var pressApplyForm = document.getElementById("press-apply-form");
var pressFormMessage = document.getElementById("press-form-message");
function initPressApplyForm() {
  if (!pressApplyForm || !pressFormMessage) {
    return;
  }
  pressApplyForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("press-name").value;
    const mediaName = document.getElementById("media-name").value;
    const position = document.getElementById("position").value;
    const email = document.getElementById("press-email").value;
    const phone = document.getElementById("press-phone").value;
    const coverageContent = document.getElementById("coverage-content").value;
    const publishDate = document.getElementById("publish-date").value;
    const pressDuration = document.getElementById("press-duration").value;
    const note = document.getElementById("press-note").value;
    if (!name || !mediaName || !email || !coverageContent || !pressDuration) {
      showPressFormMessage("\u3059\u3079\u3066\u306E\u5FC5\u9808\u9805\u76EE\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002", "error");
      return;
    }
    const formData = {
      mediaName,
      contactPerson: `${name}${position ? ` (${position})` : ""}`,
      email,
      phone,
      coverageContent,
      publicationDate: publishDate || void 0,
      requiredPeriodStart: void 0,
      // Calculated from pressDuration
      requiredPeriodEnd: void 0,
      // Calculated from pressDuration
      note
    };
    if (pressDuration) {
      const days = parseInt(pressDuration.replace("days", ""));
      const startDate = /* @__PURE__ */ new Date();
      const endDate = /* @__PURE__ */ new Date();
      endDate.setDate(endDate.getDate() + days);
      formData.requiredPeriodStart = startDate.toISOString().split("T")[0];
      formData.requiredPeriodEnd = endDate.toISOString().split("T")[0];
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showPressFormMessage("\u6709\u52B9\u306A\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002", "error");
      return;
    }
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
      showPressFormMessage(result.message, "success");
      pressApplyForm.reset();
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    } catch (error) {
      console.error("Press apply form submission error:", error);
      showPressFormMessage("\u9001\u4FE1\u4E2D\u306B\u30A8\u30E9\u30FC\u304C\u767A\u751F\u3057\u307E\u3057\u305F\u3002\u3082\u3046\u4E00\u5EA6\u304A\u8A66\u3057\u304F\u3060\u3055\u3044\u3002", "error");
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
