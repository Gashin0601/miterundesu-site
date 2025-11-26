/**
 * Email Service using Nodemailer (SMTP)
 * Handles all email notifications for form submissions
 */

import nodemailer from 'nodemailer';

// Create transporter with SMTP settings
let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (!transporter) {
    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || '587');
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !user || !pass) {
      throw new Error('SMTP configuration is incomplete. Check SMTP_HOST, SMTP_USER, SMTP_PASS');
    }

    transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true for 465, false for other ports
      auth: {
        user,
        pass
      }
    });
  }
  return transporter;
}

const FROM_EMAIL = process.env.EMAIL_FROM || 'info@miterundesu.jp';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'info@miterundesu.jp';

/**
 * Send contact form notification emails
 */
export async function sendContactEmails(data: {
  name: string;
  email: string;
  inquiryType: string;
  message: string;
  // Optional fields based on inquiry type
  mediaName?: string;
  position?: string;
  pressPhone?: string;
  publishDate?: string;
  pressDuration?: string;
  storeName?: string;
  industry?: string;
  location?: string;
  storePhone?: string;
  posterType?: string;
  deviceInfo?: string;
  errorMessage?: string;
}) {
  const inquiryTypeLabels: Record<string, string> = {
    press: '取材について',
    store: '店舗導入について',
    usage: 'アプリの使い方',
    other: 'その他'
  };

  // Build additional fields HTML based on inquiry type
  let additionalFieldsHtml = '';

  if (data.inquiryType === 'press') {
    if (data.mediaName) {
      additionalFieldsHtml += `
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 8px; font-weight: bold;">媒体名</td>
          <td style="padding: 8px;">${escapeHtml(data.mediaName)}</td>
        </tr>`;
    }
    if (data.position) {
      additionalFieldsHtml += `
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 8px; font-weight: bold;">役職・部署</td>
          <td style="padding: 8px;">${escapeHtml(data.position)}</td>
        </tr>`;
    }
    if (data.pressPhone) {
      additionalFieldsHtml += `
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 8px; font-weight: bold;">電話番号</td>
          <td style="padding: 8px;">${escapeHtml(data.pressPhone)}</td>
        </tr>`;
    }
    if (data.publishDate) {
      additionalFieldsHtml += `
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 8px; font-weight: bold;">掲載予定日</td>
          <td style="padding: 8px;">${escapeHtml(data.publishDate)}</td>
        </tr>`;
    }
    if (data.pressDuration) {
      additionalFieldsHtml += `
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 8px; font-weight: bold;">プレスモード利用期間</td>
          <td style="padding: 8px;">${escapeHtml(data.pressDuration)}</td>
        </tr>`;
    }
  } else if (data.inquiryType === 'store') {
    if (data.storeName) {
      additionalFieldsHtml += `
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 8px; font-weight: bold;">店舗・施設名</td>
          <td style="padding: 8px;">${escapeHtml(data.storeName)}</td>
        </tr>`;
    }
    if (data.industry) {
      const industryLabels: Record<string, string> = {
        supermarket: 'スーパー',
        convenience: 'コンビニ',
        museum: '美術館',
        theater: '映画館・劇場',
        hospital: '病院',
        other: 'その他'
      };
      additionalFieldsHtml += `
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 8px; font-weight: bold;">業種</td>
          <td style="padding: 8px;">${industryLabels[data.industry] || data.industry}</td>
        </tr>`;
    }
    if (data.location) {
      additionalFieldsHtml += `
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 8px; font-weight: bold;">所在地</td>
          <td style="padding: 8px;">${escapeHtml(data.location)}</td>
        </tr>`;
    }
    if (data.storePhone) {
      additionalFieldsHtml += `
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 8px; font-weight: bold;">電話番号</td>
          <td style="padding: 8px;">${escapeHtml(data.storePhone)}</td>
        </tr>`;
    }
    if (data.posterType) {
      const posterLabels: Record<string, string> = {
        green: '通常モード（グリーン）',
        orange: 'シアターモード（オレンジ）'
      };
      additionalFieldsHtml += `
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 8px; font-weight: bold;">ポスター種類</td>
          <td style="padding: 8px;">${posterLabels[data.posterType] || data.posterType}</td>
        </tr>`;
    }
  } else if (data.inquiryType === 'usage') {
    if (data.deviceInfo) {
      additionalFieldsHtml += `
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 8px; font-weight: bold;">端末情報</td>
          <td style="padding: 8px;">${escapeHtml(data.deviceInfo)}</td>
        </tr>`;
    }
    if (data.errorMessage) {
      additionalFieldsHtml += `
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 8px; font-weight: bold;">エラーメッセージ</td>
          <td style="padding: 8px; white-space: pre-wrap;">${escapeHtml(data.errorMessage)}</td>
        </tr>`;
    }
  }

  // Email to admin
  const adminMailOptions = {
    from: `"ミテルンデス" <${FROM_EMAIL}>`,
    to: ADMIN_EMAIL,
    subject: `【お問い合わせ】${inquiryTypeLabels[data.inquiryType]} - ${data.name}様`,
    html: `
      <h2>新しいお問い合わせが届きました</h2>

      <h3>お問い合わせ内容</h3>
      <table style="border-collapse: collapse; width: 100%;">
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 8px; font-weight: bold;">お名前</td>
          <td style="padding: 8px;">${escapeHtml(data.name)}</td>
        </tr>
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 8px; font-weight: bold;">メールアドレス</td>
          <td style="padding: 8px;">${escapeHtml(data.email)}</td>
        </tr>
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 8px; font-weight: bold;">お問い合わせ種類</td>
          <td style="padding: 8px;">${inquiryTypeLabels[data.inquiryType]}</td>
        </tr>
        ${additionalFieldsHtml}
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 8px; font-weight: bold; vertical-align: top;">お問い合わせ内容</td>
          <td style="padding: 8px; white-space: pre-wrap;">${escapeHtml(data.message)}</td>
        </tr>
      </table>

      <p style="margin-top: 20px; color: #666;">
        受信日時: ${new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}
      </p>
    `
  };

  // Confirmation email to user
  const userMailOptions = {
    from: `"ミテルンデス" <${FROM_EMAIL}>`,
    to: data.email,
    subject: '【ミテルンデス】お問い合わせを受け付けました',
    html: `
      <h2>${escapeHtml(data.name)} 様</h2>

      <p>この度は、ミテルンデスにお問い合わせいただき、誠にありがとうございます。</p>

      <p>以下の内容でお問い合わせを受け付けました。</p>

      <table style="border-collapse: collapse; width: 100%; margin: 20px 0;">
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 8px; font-weight: bold;">お問い合わせ種類</td>
          <td style="padding: 8px;">${inquiryTypeLabels[data.inquiryType]}</td>
        </tr>
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 8px; font-weight: bold; vertical-align: top;">お問い合わせ内容</td>
          <td style="padding: 8px; white-space: pre-wrap;">${escapeHtml(data.message)}</td>
        </tr>
      </table>

      <p>2〜3営業日以内に担当者よりご連絡させていただきます。<br>
      今しばらくお待ちくださいますよう、お願い申し上げます。</p>

      <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">

      <p style="color: #666; font-size: 0.9em;">
        ミテルンデス<br>
        https://miterundesu.jp
      </p>
    `
  };

  try {
    const transport = getTransporter();
    await Promise.all([
      transport.sendMail(adminMailOptions),
      transport.sendMail(userMailOptions)
    ]);
    return { success: true };
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
}

/**
 * Send store application notification emails
 */
export async function sendStoreApplicationEmails(data: {
  storeName: string;
  industry: string;
  posterType: string;
  location?: string;
  email?: string;
  phone?: string;
  note?: string;
}) {
  const industryLabels: Record<string, string> = {
    supermarket: 'スーパーマーケット',
    convenience: 'コンビニエンスストア',
    museum: '美術館・博物館',
    theater: '映画館・劇場',
    hospital: '病院・クリニック',
    other: 'その他'
  };

  const posterTypeLabels: Record<string, string> = {
    green: 'グリーン（通常モード）',
    orange: 'オレンジ（シアターモード）'
  };

  // Email to admin
  const adminMailOptions = {
    from: `"ミテルンデス" <${FROM_EMAIL}>`,
    to: ADMIN_EMAIL,
    subject: `【店舗導入申し込み】${data.storeName}`,
    html: `
      <h2>新しい店舗導入申し込みが届きました</h2>

      <h3>申し込み内容</h3>
      <table style="border-collapse: collapse; width: 100%;">
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 8px; font-weight: bold;">店舗・施設名</td>
          <td style="padding: 8px;">${escapeHtml(data.storeName)}</td>
        </tr>
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 8px; font-weight: bold;">業種</td>
          <td style="padding: 8px;">${industryLabels[data.industry] || data.industry}</td>
        </tr>
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 8px; font-weight: bold;">ポスター種類</td>
          <td style="padding: 8px;">${posterTypeLabels[data.posterType] || data.posterType}</td>
        </tr>
        ${data.location ? `
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 8px; font-weight: bold;">所在地</td>
          <td style="padding: 8px;">${escapeHtml(data.location)}</td>
        </tr>
        ` : ''}
        ${data.email ? `
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 8px; font-weight: bold;">メールアドレス</td>
          <td style="padding: 8px;">${escapeHtml(data.email)}</td>
        </tr>
        ` : ''}
        ${data.phone ? `
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 8px; font-weight: bold;">電話番号</td>
          <td style="padding: 8px;">${escapeHtml(data.phone)}</td>
        </tr>
        ` : ''}
        ${data.note ? `
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 8px; font-weight: bold; vertical-align: top;">備考</td>
          <td style="padding: 8px; white-space: pre-wrap;">${escapeHtml(data.note)}</td>
        </tr>
        ` : ''}
      </table>

      <p style="margin-top: 20px; color: #666;">
        受信日時: ${new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}
      </p>
    `
  };

  const emails: nodemailer.SendMailOptions[] = [adminMailOptions];

  // Confirmation email to store (if email provided)
  if (data.email) {
    const storeMailOptions = {
      from: `"ミテルンデス" <${FROM_EMAIL}>`,
      to: data.email,
      subject: '【ミテルンデス】店舗導入申し込みを受け付けました',
      html: `
        <h2>${escapeHtml(data.storeName)} 様</h2>

        <p>この度は、ミテルンデスの店舗導入をご検討いただき、誠にありがとうございます。</p>

        <p>以下の内容で申し込みを受け付けました。</p>

        <table style="border-collapse: collapse; width: 100%; margin: 20px 0;">
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 8px; font-weight: bold;">業種</td>
            <td style="padding: 8px;">${industryLabels[data.industry] || data.industry}</td>
          </tr>
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 8px; font-weight: bold;">ポスター種類</td>
            <td style="padding: 8px;">${posterTypeLabels[data.posterType] || data.posterType}</td>
          </tr>
        </table>

        <p>2〜3営業日以内に担当者よりご連絡させていただきます。<br>
        今しばらくお待ちくださいますよう、お願い申し上げます。</p>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">

        <p style="color: #666; font-size: 0.9em;">
          ミテルンデス<br>
          https://miterundesu.jp
        </p>
      `
    };
    emails.push(storeMailOptions);
  }

  try {
    const transport = getTransporter();
    await Promise.all(emails.map(email => transport.sendMail(email)));
    return { success: true };
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
}

/**
 * Send press application notification emails
 */
export async function sendPressApplicationEmails(data: {
  organizationName: string;
  organizationType: string;
  contactPerson: string;
  email: string;
  phone?: string;
  note?: string;
}) {
  const orgTypeLabels: Record<string, string> = {
    newspaper: '新聞',
    tv: 'テレビ',
    magazine: '雑誌',
    web_media: 'ウェブメディア',
    other: 'その他'
  };

  // Email to admin
  const adminMailOptions = {
    from: `"ミテルンデス" <${FROM_EMAIL}>`,
    to: ADMIN_EMAIL,
    subject: `【プレスモード申請】${data.organizationName}`,
    html: `
      <h2>新しいプレスモード申請が届きました</h2>

      <h3>申請内容</h3>
      <table style="border-collapse: collapse; width: 100%;">
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 8px; font-weight: bold;">組織名</td>
          <td style="padding: 8px;">${escapeHtml(data.organizationName)}</td>
        </tr>
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 8px; font-weight: bold;">組織種別</td>
          <td style="padding: 8px;">${orgTypeLabels[data.organizationType] || data.organizationType}</td>
        </tr>
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 8px; font-weight: bold;">ご担当者名</td>
          <td style="padding: 8px;">${escapeHtml(data.contactPerson)}</td>
        </tr>
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 8px; font-weight: bold;">メールアドレス</td>
          <td style="padding: 8px;">${escapeHtml(data.email)}</td>
        </tr>
        ${data.phone ? `
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 8px; font-weight: bold;">電話番号</td>
          <td style="padding: 8px;">${escapeHtml(data.phone)}</td>
        </tr>
        ` : ''}
        ${data.note ? `
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 8px; font-weight: bold; vertical-align: top;">備考</td>
          <td style="padding: 8px; white-space: pre-wrap;">${escapeHtml(data.note)}</td>
        </tr>
        ` : ''}
      </table>

      <p style="margin-top: 20px; color: #666;">
        受信日時: ${new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}
      </p>
    `
  };

  // Confirmation email to press
  const pressMailOptions = {
    from: `"ミテルンデス" <${FROM_EMAIL}>`,
    to: data.email,
    subject: '【ミテルンデス】プレスモード申請を受け付けました',
    html: `
      <h2>${escapeHtml(data.contactPerson)} 様</h2>

      <p>この度は、ミテルンデスのプレスモード申請をいただき、誠にありがとうございます。</p>

      <p>以下の内容で申請を受け付けました。</p>

      <table style="border-collapse: collapse; width: 100%; margin: 20px 0;">
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 8px; font-weight: bold;">組織名</td>
          <td style="padding: 8px;">${escapeHtml(data.organizationName)}</td>
        </tr>
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 8px; font-weight: bold;">組織種別</td>
          <td style="padding: 8px;">${orgTypeLabels[data.organizationType] || data.organizationType}</td>
        </tr>
      </table>

      <p>2〜3営業日以内に審査を行い、承認後にIDおよびパスワードをメールにてお送りします。<br>
      今しばらくお待ちくださいますよう、お願い申し上げます。</p>

      <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">

      <p style="color: #666; font-size: 0.9em;">
        ミテルンデス<br>
        https://miterundesu.jp
      </p>
    `
  };

  try {
    const transport = getTransporter();
    await Promise.all([
      transport.sendMail(adminMailOptions),
      transport.sendMail(pressMailOptions)
    ]);
    return { success: true };
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
}

/**
 * Escape HTML special characters to prevent XSS
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}
