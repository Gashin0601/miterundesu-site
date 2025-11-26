/**
 * Store Apply Page - Form Handling
 * 店舗導入申し込みフォーム
 */

// DOM Element Selectors
const storeApplyForm = document.getElementById('store-apply-form') as HTMLFormElement | null;
const storeFormMessage = document.getElementById('store-form-message') as HTMLDivElement | null;

/**
 * Initialize Store Apply Form
 */
function initStoreApplyForm() {
  if (!storeApplyForm || !storeFormMessage) {
    return;
  }

  storeApplyForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get form elements
    const storeNameEl = document.getElementById('store-name') as HTMLInputElement | null;
    const industryEl = document.getElementById('industry') as HTMLSelectElement | null;
    const posterTypeEl = document.querySelector('input[name="poster-type"]:checked') as HTMLInputElement | null;
    const locationEl = document.getElementById('location') as HTMLInputElement | null;
    const emailEl = document.getElementById('store-email') as HTMLInputElement | null;
    const phoneEl = document.getElementById('store-phone') as HTMLInputElement | null;
    const noteEl = document.getElementById('store-note') as HTMLTextAreaElement | null;

    // Get form data
    const storeName = storeNameEl?.value.trim() || '';
    const industry = industryEl?.value || '';
    const posterType = posterTypeEl?.value || '';
    const location = locationEl?.value.trim() || '';
    const email = emailEl?.value.trim() || '';
    const phone = phoneEl?.value.trim() || '';
    const note = noteEl?.value.trim() || '';

    // Validate required fields with specific messages
    if (!storeName) {
      showStoreFormMessage('店舗・施設名を入力してください。', 'error');
      storeNameEl?.focus();
      return;
    }

    if (!industry) {
      showStoreFormMessage('業種を選択してください。', 'error');
      industryEl?.focus();
      return;
    }

    if (!posterType) {
      showStoreFormMessage('ポスター種類を選択してください。', 'error');
      // Focus on first radio button
      const firstRadio = document.getElementById('poster-green') as HTMLInputElement | null;
      firstRadio?.focus();
      return;
    }

    // Email validation (if provided)
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showStoreFormMessage('有効なメールアドレスを入力してください。', 'error');
        emailEl?.focus();
        return;
      }
    }

    const formData = {
      storeName,
      industry,
      posterType,
      location: location || undefined,
      email: email || undefined,
      phone: phone || undefined,
      note: note || undefined
    };

    try {
      // Show loading state
      const submitButton = storeApplyForm.querySelector('button[type="submit"]') as HTMLButtonElement;
      const originalText = submitButton.textContent || '送信する';
      submitButton.disabled = true;
      submitButton.textContent = '送信中...';

      // Submit to API
      const response = await fetch('/api/store-application', {
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
      showStoreFormMessage(result.message || 'ご連絡ありがとうございます！\n確認メールをお送りしましたのでご確認ください。\n2〜3営業日以内に担当者よりご連絡させていただきます。', 'success');

      // Reset form
      storeApplyForm.reset();

      // Reset submit button
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    } catch (error) {
      console.error('Store apply form submission error:', error);
      const errorMessage = error instanceof Error ? error.message : '送信中にエラーが発生しました。もう一度お試しください。';
      showStoreFormMessage(errorMessage, 'error');

      // Reset submit button
      const submitButton = storeApplyForm.querySelector('button[type="submit"]') as HTMLButtonElement;
      submitButton.disabled = false;
      submitButton.textContent = '送信する';
    }
  });
}

/**
 * Display form message to user
 */
function showStoreFormMessage(message: string, type: 'success' | 'error') {
  if (!storeFormMessage) return;

  storeFormMessage.textContent = message;
  storeFormMessage.className = `form-message ${type}`;
  storeFormMessage.style.display = 'block';

  // Scroll to message
  storeFormMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  // Auto-hide success messages after 8 seconds
  if (type === 'success') {
    setTimeout(() => {
      if (storeFormMessage) {
        storeFormMessage.style.display = 'none';
      }
    }, 8000);
  }
}

// Initialize on DOM Content Loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initStoreApplyForm);
} else {
  initStoreApplyForm();
}

export { initStoreApplyForm, showStoreFormMessage };
