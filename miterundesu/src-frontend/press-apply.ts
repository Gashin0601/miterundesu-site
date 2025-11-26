/**
 * Press Apply Page - Form Handling
 * プレスモード申請フォーム
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

    // Get form elements
    const organizationNameEl = document.getElementById('organization-name') as HTMLInputElement | null;
    const organizationTypeEl = document.getElementById('organization-type') as HTMLSelectElement | null;
    const contactPersonEl = document.getElementById('contact-person') as HTMLInputElement | null;
    const emailEl = document.getElementById('press-email') as HTMLInputElement | null;
    const phoneEl = document.getElementById('press-phone') as HTMLInputElement | null;
    const noteEl = document.getElementById('press-note') as HTMLTextAreaElement | null;

    // Get form data
    const organizationName = organizationNameEl?.value.trim() || '';
    const organizationType = organizationTypeEl?.value || '';
    const contactPerson = contactPersonEl?.value.trim() || '';
    const email = emailEl?.value.trim() || '';
    const phone = phoneEl?.value.trim() || '';
    const note = noteEl?.value.trim() || '';

    // Validate required fields with specific messages
    if (!organizationName) {
      showPressFormMessage('組織名を入力してください。', 'error');
      organizationNameEl?.focus();
      return;
    }

    if (!organizationType) {
      showPressFormMessage('組織種別を選択してください。', 'error');
      organizationTypeEl?.focus();
      return;
    }

    if (!contactPerson) {
      showPressFormMessage('担当者名を入力してください。', 'error');
      contactPersonEl?.focus();
      return;
    }

    if (!email) {
      showPressFormMessage('メールアドレスを入力してください。', 'error');
      emailEl?.focus();
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showPressFormMessage('有効なメールアドレスを入力してください。', 'error');
      emailEl?.focus();
      return;
    }

    // Map form data to API format
    const formData = {
      organizationName,
      organizationType,
      contactPerson,
      email,
      phone: phone || undefined,
      note: note || undefined
    };

    try {
      // Show loading state
      const submitButton = pressApplyForm.querySelector('button[type="submit"]') as HTMLButtonElement;
      const originalText = submitButton.textContent || '申し込む';
      submitButton.disabled = true;
      submitButton.textContent = '送信中...';

      // Submit to API
      const response = await fetch('/api/press-application', {
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
      showPressFormMessage(result.message || '申請を受け付けました。\n確認メールをお送りしましたのでご確認ください。\n2〜3営業日以内に審査を行い、結果をメールにてお知らせします。', 'success');

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

  // Auto-hide success messages after 8 seconds
  if (type === 'success') {
    setTimeout(() => {
      if (pressFormMessage) {
        pressFormMessage.style.display = 'none';
      }
    }, 8000);
  }
}

// Initialize on DOM Content Loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPressApplyForm);
} else {
  initPressApplyForm();
}

export { initPressApplyForm, showPressFormMessage };
