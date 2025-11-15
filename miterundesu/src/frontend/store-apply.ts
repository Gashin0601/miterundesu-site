/**
 * Store Apply Page - Form Handling
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

    // Get form data
    const formData = {
      storeName: (document.getElementById('store-name') as HTMLInputElement).value,
      industry: (document.getElementById('industry') as HTMLSelectElement).value,
      posterType: (document.querySelector('input[name="poster-type"]:checked') as HTMLInputElement)?.value || '',
      location: (document.getElementById('location') as HTMLInputElement).value,
      email: (document.getElementById('store-email') as HTMLInputElement).value,
      phone: (document.getElementById('store-phone') as HTMLInputElement).value,
      note: (document.getElementById('store-note') as HTMLTextAreaElement).value
    };

    // Validate required fields
    if (!formData.storeName || !formData.industry || !formData.posterType) {
      showStoreFormMessage('すべての必須項目を入力してください。', 'error');
      return;
    }

    // Email validation (if provided)
    if (formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        showStoreFormMessage('有効なメールアドレスを入力してください。', 'error');
        return;
      }
    }

    try {
      // Show loading state
      const submitButton = storeApplyForm.querySelector('button[type="submit"]') as HTMLButtonElement;
      const originalText = submitButton.textContent || '送信する';
      submitButton.disabled = true;
      submitButton.textContent = '送信中...';

      // TODO: Add API endpoint for form submission
      // For now, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Temporary: Log to console (will be replaced with actual API call)
      console.log('Store apply form submitted:', formData);

      // Show success message
      showStoreFormMessage(
        'ご連絡ありがとうございます！\n受付完了メールをお送りしました。\n2〜3営業日以内に担当者よりご連絡させていただきます。',
        'success'
      );

      // Reset form
      storeApplyForm.reset();

      // Reset submit button
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    } catch (error) {
      console.error('Store apply form submission error:', error);
      showStoreFormMessage('送信中にエラーが発生しました。もう一度お試しください。', 'error');

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

  // Auto-hide success messages after 5 seconds
  if (type === 'success') {
    setTimeout(() => {
      if (storeFormMessage) {
        storeFormMessage.style.display = 'none';
      }
    }, 5000);
  }
}

// Initialize on DOM Content Loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initStoreApplyForm);
} else {
  initStoreApplyForm();
}

export { initStoreApplyForm, showStoreFormMessage };
