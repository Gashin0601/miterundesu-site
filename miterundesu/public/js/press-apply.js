// public/js/press-apply.js

const pressApplyForm = document.getElementById('press-apply-form');
const pressFormMessage = document.getElementById('press-form-message');

function initPressApplyForm() {
  if (!pressApplyForm || !pressFormMessage) {
    return;
  }

  pressApplyForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get form values
    const userId = document.getElementById('user-id').value.trim();
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    const organizationName = document.getElementById('organization-name').value.trim();
    const organizationType = document.getElementById('organization-type').value;
    const contactPerson = document.getElementById('contact-person').value.trim();
    const email = document.getElementById('press-email').value.trim();
    const phone = document.getElementById('press-phone').value.trim();
    const note = document.getElementById('press-note').value.trim();

    // Validation
    if (!userId || !password || !passwordConfirm || !organizationName || !organizationType || !contactPerson || !email) {
      showPressFormMessage('すべての必須項目を入力してください。', 'error');
      return;
    }

    // User ID validation
    const userIdRegex = /^[a-zA-Z0-9\-_]{4,20}$/;
    if (!userIdRegex.test(userId)) {
      showPressFormMessage('ユーザーIDは4〜20文字の半角英数字、ハイフン(-)、アンダースコア(_)で入力してください。', 'error');
      return;
    }

    // Password validation
    if (password.length < 8) {
      showPressFormMessage('パスワードは8文字以上で設定してください。', 'error');
      return;
    }

    // Password confirmation
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

    const formData = {
      userId,
      password,
      organizationName,
      organizationType,
      contactPerson,
      email,
      phone: phone || undefined,
      note: note || undefined
    };

    try {
      const submitButton = pressApplyForm.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent || '申し込む';
      submitButton.disabled = true;
      submitButton.textContent = '送信中...';

      const response = await fetch('/api/press-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '送信に失敗しました');
      }

      showPressFormMessage(result.message, 'success');
      pressApplyForm.reset();

      submitButton.disabled = false;
      submitButton.textContent = originalText;
    } catch (error) {
      console.error('Press account creation error:', error);
      showPressFormMessage(
        error.message || '送信中にエラーが発生しました。もう一度お試しください。',
        'error'
      );

      const submitButton = pressApplyForm.querySelector('button[type="submit"]');
      submitButton.disabled = false;
      submitButton.textContent = '申し込む';
    }
  });
}

function showPressFormMessage(message, type) {
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

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPressApplyForm);
} else {
  initPressApplyForm();
}

export { initPressApplyForm, showPressFormMessage };
