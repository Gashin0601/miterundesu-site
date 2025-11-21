/**
 * Press Apply Page - Form Handling (User ID + Password Authentication)
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
    const userId = (document.getElementById('user-id') as HTMLInputElement).value.trim();
    const password = (document.getElementById('password') as HTMLInputElement).value;
    const passwordConfirm = (document.getElementById('password-confirm') as HTMLInputElement).value;
    const organizationName = (document.getElementById('organization-name') as HTMLInputElement).value.trim();
    const organizationType = (document.getElementById('organization-type') as HTMLSelectElement).value;
    const contactPerson = (document.getElementById('contact-person') as HTMLInputElement).value.trim();
    const email = (document.getElementById('press-email') as HTMLInputElement).value.trim();
    const phone = (document.getElementById('press-phone') as HTMLInputElement).value.trim();
    const note = (document.getElementById('press-note') as HTMLTextAreaElement).value.trim();

    // Validate required fields
    if (!userId || !password || !passwordConfirm || !organizationName || !organizationType || !contactPerson || !email) {
      showPressFormMessage('すべての必須項目を入力してください。', 'error');
      return;
    }

    // Validate user ID format
    const userIdRegex = /^[a-zA-Z0-9\-_]{4,20}$/;
    if (!userIdRegex.test(userId)) {
      showPressFormMessage('ユーザーIDは4〜20文字の半角英数字、ハイフン、アンダースコアで入力してください。', 'error');
      return;
    }

    // Validate password length
    if (password.length < 8) {
      showPressFormMessage('パスワードは8文字以上で入力してください。', 'error');
      return;
    }

    // Validate password match
    if (password !== passwordConfirm) {
      showPressFormMessage('パスワードが一致しません。', 'error');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showPressFormMessage('有効なメールアドレスを入力してください。', 'error');
      return;
    }

    // Map form data to API format
    const formData = {
      userId,
      password,
      organizationName,
      organizationType,
      contactName: contactPerson,
      contactEmail: email,
      contactPhone: phone || undefined,
      notes: note || undefined
    };

    try {
      // Show loading state
      const submitButton = pressApplyForm.querySelector('button[type="submit"]') as HTMLButtonElement;
      const originalText = submitButton.textContent || '申し込む';
      submitButton.disabled = true;
      submitButton.textContent = '送信中...';

      // Submit to API
      const response = await fetch('/api/press-account-application', {
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
      showPressFormMessage(result.message || 'お申し込みありがとうございます。審査完了後、メールにてご連絡いたします。', 'success');

      // Reset form
      pressApplyForm.reset();

      // Reset submit button
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    } catch (error) {
      console.error('Press apply form submission error:', error);
      const errorMessage = error instanceof Error ? error.message : '送信中にエラーが発生しました。もう一度お試しください。';
      showPressFormMessage(errorMessage, 'error');

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
