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
    const name = (document.getElementById('press-name') as HTMLInputElement).value;
    const mediaName = (document.getElementById('media-name') as HTMLInputElement).value;
    const position = (document.getElementById('position') as HTMLInputElement).value;
    const email = (document.getElementById('press-email') as HTMLInputElement).value;
    const phone = (document.getElementById('press-phone') as HTMLInputElement).value;
    const coverageContent = (document.getElementById('coverage-content') as HTMLTextAreaElement).value;
    const publishDate = (document.getElementById('publish-date') as HTMLInputElement).value;
    const pressDuration = (document.getElementById('press-duration') as HTMLSelectElement).value;
    const note = (document.getElementById('press-note') as HTMLTextAreaElement).value;

    // Validate required fields
    if (!name || !mediaName || !email || !coverageContent || !pressDuration) {
      showPressFormMessage('すべての必須項目を入力してください。', 'error');
      return;
    }

    // Map form data to API format
    const formData = {
      mediaName,
      contactPerson: `${name}${position ? ` (${position})` : ''}`,
      email,
      phone,
      coverageContent,
      publicationDate: publishDate || undefined,
      requiredPeriodStart: undefined, // Calculated from pressDuration
      requiredPeriodEnd: undefined,   // Calculated from pressDuration
      note
    };

    // Calculate period from pressDuration (e.g., "7days", "14days", "30days")
    if (pressDuration) {
      const days = parseInt(pressDuration.replace('days', ''));
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + days);

      formData.requiredPeriodStart = startDate.toISOString().split('T')[0];
      formData.requiredPeriodEnd = endDate.toISOString().split('T')[0];
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
      showPressFormMessage(result.message, 'success');

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
