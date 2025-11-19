/**
 * Email Service using Resend
 * Handles all email notifications for form submissions
 */

import { Resend } from 'resend';

// Lazy initialization to avoid crashing when API key is missing
let resend: Resend | null = null;

function getResendClient(): Resend {
  if (!resend) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error('RESEND_API_KEY environment variable is not set');
    }
    resend = new Resend(apiKey);
  }
  return resend;
}

const FROM_EMAIL = 'ミテルンデス <noreply@miterundesu.jp>';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@miterundesu.jp';

/**
 * Send contact form notification emails
 */
export async function sendContactEmails(data: {
  name: string;
  email: string;
  inquiryType: string;
  message: string;
}) {
  const inquiryTypeLabels: Record<string, string> = {
    press: 'プレス・メディア',
    store: '店舗導入',
    usage: 'アプリの使い方',
    other: 'その他'
  };

  // Email to admin
  const adminEmail = {
    from: FROM_EMAIL,
    to: ADMIN_EMAIL,
    subject: `【お問い合わせ】${inquiryTypeLabels[data.inquiryType]} - ${data.name}様`,
    html: `
      <h2>新しいお問い合わせが届きました</h2>

      <h3>お問い合わせ内容</h3>
      <table style="border-collapse: collapse; width: 100%;">
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 8px; font-weight: bold;">お名前</td>
          <td style="padding: 8px;">${data.name}</td>
        </tr>
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 8px; font-weight: bold;">メールアドレス</td>
          <td style="padding: 8px;">${data.email}</td>
        </tr>
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 8px; font-weight: bold;">お問い合わせ種類</td>
          <td style="padding: 8px;">${inquiryTypeLabels[data.inquiryType]}</td>
        </tr>
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 8px; font-weight: bold; vertical-align: top;">お問い合わせ内容</td>
          <td style="padding: 8px; white-space: pre-wrap;">${data.message}</td>
        </tr>
      </table>

      <p style="margin-top: 20px; color: #666;">
        受信日時: ${new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}
      </p>
    `
  };

  // Confirmation email to user
  const userEmail = {
    from: FROM_EMAIL,
    to: data.email,
    subject: '【ミテルンデス】お問い合わせを受け付けました',
    html: `
      <h2>${data.name} 様</h2>

      <p>この度は、ミテルンデスにお問い合わせいただき、誠にありがとうございます。</p>

      <p>以下の内容でお問い合わせを受け付けました。</p>

      <table style="border-collapse: collapse; width: 100%; margin: 20px 0;">
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 8px; font-weight: bold;">お問い合わせ種類</td>
          <td style="padding: 8px;">${inquiryTypeLabels[data.inquiryType]}</td>
        </tr>
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 8px; font-weight: bold; vertical-align: top;">お問い合わせ内容</td>
          <td style="padding: 8px; white-space: pre-wrap;">${data.message}</td>
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
    const client = getResendClient();
    await Promise.all([
      client.emails.send(adminEmail),
      client.emails.send(userEmail)
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
  const adminEmail = {
    from: FROM_EMAIL,
    to: ADMIN_EMAIL,
    subject: `【店舗導入申し込み】${data.storeName}`,
    html: `
      <h2>新しい店舗導入申し込みが届きました</h2>

      <h3>申し込み内容</h3>
      <table style="border-collapse: collapse; width: 100%;">
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 8px; font-weight: bold;">店舗・施設名</td>
          <td style="padding: 8px;">${data.storeName}</td>
        </tr>
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 8px; font-weight: bold;">業種</td>
          <td style="padding: 8px;">${industryLabels[data.industry]}</td>
        </tr>
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 8px; font-weight: bold;">ポスター種類</td>
          <td style="padding: 8px;">${posterTypeLabels[data.posterType]}</td>
        </tr>
        ${data.location ? `
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 8px; font-weight: bold;">所在地</td>
          <td style="padding: 8px;">${data.location}</td>
        </tr>
        ` : ''}
        ${data.email ? `
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 8px; font-weight: bold;">メールアドレス</td>
          <td style="padding: 8px;">${data.email}</td>
        </tr>
        ` : ''}
        ${data.phone ? `
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 8px; font-weight: bold;">電話番号</td>
          <td style="padding: 8px;">${data.phone}</td>
        </tr>
        ` : ''}
        ${data.note ? `
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 8px; font-weight: bold; vertical-align: top;">備考</td>
          <td style="padding: 8px; white-space: pre-wrap;">${data.note}</td>
        </tr>
        ` : ''}
      </table>

      <p style="margin-top: 20px; color: #666;">
        受信日時: ${new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}
      </p>
    `
  };

  const emails: any[] = [adminEmail];

  // Confirmation email to store (if email provided)
  if (data.email) {
    const storeEmail = {
      from: FROM_EMAIL,
      to: data.email,
      subject: '【ミテルンデス】店舗導入申し込みを受け付けました',
      html: `
        <h2>${data.storeName} 様</h2>

        <p>この度は、ミテルンデスの店舗導入をご検討いただき、誠にありがとうございます。</p>

        <p>以下の内容で申し込みを受け付けました。</p>

        <table style="border-collapse: collapse; width: 100%; margin: 20px 0;">
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 8px; font-weight: bold;">業種</td>
            <td style="padding: 8px;">${industryLabels[data.industry]}</td>
          </tr>
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 8px; font-weight: bold;">ポスター種類</td>
            <td style="padding: 8px;">${posterTypeLabels[data.posterType]}</td>
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
    emails.push(storeEmail);
  }

  try {
    const client = getResendClient();
    await Promise.all(emails.map(email => client.emails.send(email)));
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
  mediaName: string;
  contactPerson: string;
  email: string;
  phone?: string;
  coverageContent: string;
  publicationDate?: string;
  requiredPeriodStart?: string;
  requiredPeriodEnd?: string;
  note?: string;
}) {
  // Email to admin
  const adminEmail = {
    from: FROM_EMAIL,
    to: ADMIN_EMAIL,
    subject: `【プレスモード申請】${data.mediaName} - ${data.contactPerson}様`,
    html: `
      <h2>新しいプレスモード申請が届きました</h2>

      <h3>申請内容</h3>
      <table style="border-collapse: collapse; width: 100%;">
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 8px; font-weight: bold;">媒体名</td>
          <td style="padding: 8px;">${data.mediaName}</td>
        </tr>
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 8px; font-weight: bold;">ご担当者名</td>
          <td style="padding: 8px;">${data.contactPerson}</td>
        </tr>
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 8px; font-weight: bold;">メールアドレス</td>
          <td style="padding: 8px;">${data.email}</td>
        </tr>
        ${data.phone ? `
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 8px; font-weight: bold;">電話番号</td>
          <td style="padding: 8px;">${data.phone}</td>
        </tr>
        ` : ''}
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 8px; font-weight: bold; vertical-align: top;">取材内容</td>
          <td style="padding: 8px; white-space: pre-wrap;">${data.coverageContent}</td>
        </tr>
        ${data.publicationDate ? `
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 8px; font-weight: bold;">掲載予定日</td>
          <td style="padding: 8px;">${data.publicationDate}</td>
        </tr>
        ` : ''}
        ${data.requiredPeriodStart && data.requiredPeriodEnd ? `
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 8px; font-weight: bold;">必要期間</td>
          <td style="padding: 8px;">${data.requiredPeriodStart} 〜 ${data.requiredPeriodEnd}</td>
        </tr>
        ` : ''}
        ${data.note ? `
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 8px; font-weight: bold; vertical-align: top;">その他</td>
          <td style="padding: 8px; white-space: pre-wrap;">${data.note}</td>
        </tr>
        ` : ''}
      </table>

      <p style="margin-top: 20px; color: #666;">
        受信日時: ${new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}
      </p>
    `
  };

  // Confirmation email to press
  const pressEmail = {
    from: FROM_EMAIL,
    to: data.email,
    subject: '【ミテルンデス】プレスモード申請を受け付けました',
    html: `
      <h2>${data.contactPerson} 様</h2>

      <p>この度は、ミテルンデスのプレスモード申請をいただき、誠にありがとうございます。</p>

      <p>以下の内容で申請を受け付けました。</p>

      <table style="border-collapse: collapse; width: 100%; margin: 20px 0;">
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 8px; font-weight: bold;">媒体名</td>
          <td style="padding: 8px;">${data.mediaName}</td>
        </tr>
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 8px; font-weight: bold; vertical-align: top;">取材内容</td>
          <td style="padding: 8px; white-space: pre-wrap;">${data.coverageContent}</td>
        </tr>
      </table>

      <p>2〜3営業日以内に担当者よりプレスコードをお送りします。<br>
      今しばらくお待ちくださいますよう、お願い申し上げます。</p>

      <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">

      <p style="color: #666; font-size: 0.9em;">
        ミテルンデス<br>
        https://miterundesu.jp
      </p>
    `
  };

  try {
    const client = getResendClient();
    await Promise.all([
      client.emails.send(adminEmail),
      client.emails.send(pressEmail)
    ]);
    return { success: true };
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
}
