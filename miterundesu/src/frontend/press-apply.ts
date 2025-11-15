/**
 * Press Apply Page - Form Handling
 */

// DOM Element Selectors
const pressApplyForm = document.getElementById('press-apply-form') as HTMLFormElement | null;
const pressFormMessage = document.getElementById('press-form-message') as HTMLDivElement | null;

/**
 * Initialize Press Apply Form
 */
function initPressApplyForm() {
  if (!pressApplyForm || !pressFormMessage) {
    return;
  }

  pressApplyForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get form data
    const formData = {
      name: (document.getElementById('press-name') as HTMLInputElement).value,
      mediaName: (document.getElementById('media-name') as HTMLInputElement).value,
      position: (document.getElementById('position') as HTMLInputElement).value,
      email: (document.getElementById('press-email') as HTMLInputElement).value,
      phone: (document.getElementById('press-phone') as HTMLInputElement).value,
      coverageContent: (document.getElementById('coverage-content') as HTMLTextAreaElement).value,
      publishDate: (document.getElementById('publish-date') as HTMLInputElement).value,
      pressDuration: (document.getElementById('press-duration') as HTMLSelectElement).value,
      note: (document.getElementById('press-note') as HTMLTextAreaElement).value
    };

    // Validate required fields
    if (!formData.name || !formData.mediaName || !formData.email || !formData.coverageContent || !formData.pressDuration) {
      showPressFormMessage('すべての必須項目を入力してください。', 'error');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showPressFormMessage('有効なメールアドレスを入力してください。', 'error');
      return;
    }

    try {
      // Show loading state
      const submitButton = pressApplyForm.querySelector('button[type="submit"]') as HTMLButtonElement;
      const originalText = submitButton.textContent || '申し込む';
      submitButton.disabled = true;
      submitButton.textContent = '送信中...';

      // TODO: Add API endpoint for form submission
      // For now, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Temporary: Log to console (will be replaced with actual API call)
      console.log('Press apply form submitted:', formData);

      // Show success message
      showPressFormMessage(
        'お申し込みありがとうございます！\n受付完了メールをお送りしました。\n2〜3営業日以内にプレスモードコードをメールにてお送りいたします。',
        'success'
      );

      // Reset form
      pressApplyForm.reset();

      // Reset submit button
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    } catch (error) {
      console.error('Press apply form submission error:', error);
      showPressFormMessage('送信中にエラーが発生しました。もう一度お試しください。', 'error');

      // Reset submit button
      const submitButton = pressApplyForm.querySelector('button[type="submit"]') as HTMLButtonElement;
      submitButton.disabled = false;
      submitButton.textContent = '申し込む';
    }
  });
}

/**
 * Display form message to user
 */
function showPressFormMessage(message: string, type: 'success' | 'error') {
  if (!pressFormMessage) return;

  pressFormMessage.textContent = message;
  pressFormMessage.className = `form-message ${type}`;
  pressFormMessage.style.display = 'block';

  // Scroll to message
  pressFormMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  // Auto-hide success messages after 5 seconds
  if (type === 'success') {
    setTimeout(() => {
      if (pressFormMessage) {
        pressFormMessage.style.display = 'none';
      }
    }, 5000);
  }
}

// Initialize on DOM Content Loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPressApplyForm);
} else {
  initPressApplyForm();
}

export { initPressApplyForm, showPressFormMessage };
