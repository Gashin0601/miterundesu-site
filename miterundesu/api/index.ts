import express, { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS headers
app.use((_req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  if (_req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  next();
});

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// Email configuration
let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (!transporter) {
    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || '587');
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !user || !pass) {
      throw new Error('SMTP configuration is incomplete');
    }

    transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass }
    });
  }
  return transporter;
}

const FROM_EMAIL = process.env.EMAIL_FROM || 'info@miterundesu.jp';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'info@miterundesu.jp';

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

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Contact form
app.post('/api/contact', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, inquiryType, message } = req.body;

    if (!name || !email || !inquiryType || !message) {
      res.status(400).json({ error: 'すべての必須項目を入力してください。' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ error: '有効なメールアドレスを入力してください。' });
      return;
    }

    const { data, error } = await supabase
      .from('contacts')
      .insert([{
        name,
        email,
        inquiry_type: inquiryType,
        message,
        status: 'unread'
      }])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      res.status(500).json({ error: 'データベースエラーが発生しました。' });
      return;
    }

    // Send emails
    const inquiryTypeLabels: Record<string, string> = {
      press: '取材について',
      store: '店舗導入について',
      usage: 'アプリの使い方',
      other: 'その他'
    };

    let emailStatus = 'not_attempted';
    let emailError = '';
    try {
      const transport = getTransporter();
      const results = await Promise.all([
        transport.sendMail({
          from: `"ミテルンデス" <${FROM_EMAIL}>`,
          to: ADMIN_EMAIL,
          subject: `【お問い合わせ】${inquiryTypeLabels[inquiryType]} - ${name}様`,
          html: `<h2>新しいお問い合わせが届きました</h2>
            <table style="border-collapse: collapse; width: 100%;">
              <tr><td style="padding: 8px; font-weight: bold;">お名前</td><td style="padding: 8px;">${escapeHtml(name)}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold;">メールアドレス</td><td style="padding: 8px;">${escapeHtml(email)}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold;">お問い合わせ種類</td><td style="padding: 8px;">${inquiryTypeLabels[inquiryType]}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold;">お問い合わせ内容</td><td style="padding: 8px; white-space: pre-wrap;">${escapeHtml(message)}</td></tr>
            </table>`
        }),
        transport.sendMail({
          from: `"ミテルンデス" <${FROM_EMAIL}>`,
          to: email,
          subject: '【ミテルンデス】お問い合わせを受け付けました',
          html: `<h2>${escapeHtml(name)} 様</h2>
            <p>この度は、ミテルンデスにお問い合わせいただき、誠にありがとうございます。</p>
            <p>以下の内容でお問い合わせを受け付けました。</p>
            <table style="border-collapse: collapse; width: 100%; margin: 20px 0; border: 1px solid #ddd;">
              <tr style="border-bottom: 1px solid #ddd;"><td style="padding: 8px; font-weight: bold; background: #f5f5f5;">お問い合わせ種類</td><td style="padding: 8px;">${inquiryTypeLabels[inquiryType]}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold; background: #f5f5f5;">お問い合わせ内容</td><td style="padding: 8px; white-space: pre-wrap;">${escapeHtml(message)}</td></tr>
            </table>
            <p>2〜3営業日以内に担当者よりご連絡させていただきます。<br>今しばらくお待ちくださいますよう、お願い申し上げます。</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
            <p style="color: #666;">ミテルンデス<br>https://miterundesu.jp</p>`
        })
      ]);
      emailStatus = 'sent';
      console.log('Email sent successfully:', results.map(r => r.messageId));
    } catch (err: unknown) {
      emailStatus = 'failed';
      emailError = err instanceof Error ? err.message : String(err);
      console.error('Email sending error:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'お問い合わせを受け付けました。\n確認メールをお送りしましたのでご確認ください。\n2-3営業日以内に担当者よりご連絡いたします。',
      data,
      emailStatus,
      emailError: emailError || undefined
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: '送信中にエラーが発生しました。' });
  }
});

// Store application form
app.post('/api/store-application', async (req: Request, res: Response): Promise<void> => {
  try {
    const { storeName, industry, posterType, location, email, phone, note } = req.body;

    if (!storeName || !industry || !posterType) {
      res.status(400).json({ error: 'すべての必須項目を入力してください。' });
      return;
    }

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        res.status(400).json({ error: '有効なメールアドレスを入力してください。' });
        return;
      }
    }

    const { data, error } = await supabase
      .from('store_applications')
      .insert([{
        store_name: storeName,
        industry,
        poster_type: posterType,
        location,
        email,
        phone,
        note,
        status: 'pending'
      }])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      res.status(500).json({ error: 'データベースエラーが発生しました。' });
      return;
    }

    // Send emails
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

    try {
      const transport = getTransporter();
      const emails: nodemailer.SendMailOptions[] = [{
        from: `"ミテルンデス" <${FROM_EMAIL}>`,
        to: ADMIN_EMAIL,
        subject: `【店舗導入申し込み】${storeName}`,
        html: `<h2>新しい店舗導入申し込みが届きました</h2>
          <table style="border-collapse: collapse; width: 100%;">
            <tr><td style="padding: 8px; font-weight: bold;">店舗・施設名</td><td style="padding: 8px;">${escapeHtml(storeName)}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">業種</td><td style="padding: 8px;">${industryLabels[industry] || industry}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">ポスター種類</td><td style="padding: 8px;">${posterTypeLabels[posterType] || posterType}</td></tr>
            ${location ? `<tr><td style="padding: 8px; font-weight: bold;">所在地</td><td style="padding: 8px;">${escapeHtml(location)}</td></tr>` : ''}
            ${email ? `<tr><td style="padding: 8px; font-weight: bold;">メールアドレス</td><td style="padding: 8px;">${escapeHtml(email)}</td></tr>` : ''}
            ${phone ? `<tr><td style="padding: 8px; font-weight: bold;">電話番号</td><td style="padding: 8px;">${escapeHtml(phone)}</td></tr>` : ''}
            ${note ? `<tr><td style="padding: 8px; font-weight: bold;">備考</td><td style="padding: 8px;">${escapeHtml(note)}</td></tr>` : ''}
          </table>`
      }];

      if (email) {
        emails.push({
          from: `"ミテルンデス" <${FROM_EMAIL}>`,
          to: email,
          subject: '【ミテルンデス】店舗導入申し込みを受け付けました',
          html: `<h2>${escapeHtml(storeName)} 様</h2>
            <p>この度は、ミテルンデスの店舗導入をご検討いただき、誠にありがとうございます。</p>
            <p>以下の内容で申し込みを受け付けました。</p>
            <table style="border-collapse: collapse; width: 100%; margin: 20px 0; border: 1px solid #ddd;">
              <tr style="border-bottom: 1px solid #ddd;"><td style="padding: 8px; font-weight: bold; background: #f5f5f5;">店舗・施設名</td><td style="padding: 8px;">${escapeHtml(storeName)}</td></tr>
              <tr style="border-bottom: 1px solid #ddd;"><td style="padding: 8px; font-weight: bold; background: #f5f5f5;">業種</td><td style="padding: 8px;">${industryLabels[industry] || industry}</td></tr>
              <tr style="border-bottom: 1px solid #ddd;"><td style="padding: 8px; font-weight: bold; background: #f5f5f5;">ポスター種類</td><td style="padding: 8px;">${posterTypeLabels[posterType] || posterType}</td></tr>
              ${location ? `<tr style="border-bottom: 1px solid #ddd;"><td style="padding: 8px; font-weight: bold; background: #f5f5f5;">所在地</td><td style="padding: 8px;">${escapeHtml(location)}</td></tr>` : ''}
              ${phone ? `<tr style="border-bottom: 1px solid #ddd;"><td style="padding: 8px; font-weight: bold; background: #f5f5f5;">電話番号</td><td style="padding: 8px;">${escapeHtml(phone)}</td></tr>` : ''}
              ${note ? `<tr><td style="padding: 8px; font-weight: bold; background: #f5f5f5;">備考</td><td style="padding: 8px;">${escapeHtml(note)}</td></tr>` : ''}
            </table>
            <p>2〜3営業日以内に担当者よりご連絡させていただきます。<br>今しばらくお待ちくださいますよう、お願い申し上げます。</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
            <p style="color: #666;">ミテルンデス<br>https://miterundesu.jp</p>`
        });
      }

      await Promise.all(emails.map(e => transport.sendMail(e)));
    } catch (emailError) {
      console.error('Email sending error:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'ご連絡ありがとうございます！\n受付完了メールをお送りしました。\n2〜3営業日以内に担当者よりご連絡させていただきます。',
      data
    });
  } catch (error) {
    console.error('Store application error:', error);
    res.status(500).json({ error: '送信中にエラーが発生しました。' });
  }
});

// Press application form
app.post('/api/press-application', async (req: Request, res: Response): Promise<void> => {
  try {
    const { organizationName, organizationType, contactPerson, email, phone, note } = req.body;

    if (!organizationName || !organizationType || !contactPerson || !email) {
      res.status(400).json({ error: 'すべての必須項目を入力してください。' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ error: '有効なメールアドレスを入力してください。' });
      return;
    }

    // Use actual table column names: media_name, contact_person, etc.
    const { data, error } = await supabase
      .from('press_applications')
      .insert([{
        media_name: organizationName,
        contact_person: contactPerson,
        email,
        phone: phone || null,
        note: note || null,
        coverage_content: `組織種別: ${organizationType}`,
        status: 'pending'
      }])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      res.status(500).json({ error: 'データベースエラーが発生しました。' });
      return;
    }

    // Send emails
    const orgTypeLabels: Record<string, string> = {
      newspaper: '新聞',
      tv: 'テレビ',
      magazine: '雑誌',
      web_media: 'ウェブメディア',
      other: 'その他'
    };

    try {
      const transport = getTransporter();
      await Promise.all([
        transport.sendMail({
          from: `"ミテルンデス" <${FROM_EMAIL}>`,
          to: ADMIN_EMAIL,
          subject: `【プレスモード申請】${organizationName}`,
          html: `<h2>新しいプレスモード申請が届きました</h2>
            <table style="border-collapse: collapse; width: 100%;">
              <tr><td style="padding: 8px; font-weight: bold;">組織名</td><td style="padding: 8px;">${escapeHtml(organizationName)}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold;">組織種別</td><td style="padding: 8px;">${orgTypeLabels[organizationType] || organizationType}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold;">ご担当者名</td><td style="padding: 8px;">${escapeHtml(contactPerson)}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold;">メールアドレス</td><td style="padding: 8px;">${escapeHtml(email)}</td></tr>
              ${phone ? `<tr><td style="padding: 8px; font-weight: bold;">電話番号</td><td style="padding: 8px;">${escapeHtml(phone)}</td></tr>` : ''}
              ${note ? `<tr><td style="padding: 8px; font-weight: bold;">備考</td><td style="padding: 8px;">${escapeHtml(note)}</td></tr>` : ''}
            </table>`
        }),
        transport.sendMail({
          from: `"ミテルンデス" <${FROM_EMAIL}>`,
          to: email,
          subject: '【ミテルンデス】プレスモード申請を受け付けました',
          html: `<h2>${escapeHtml(contactPerson)} 様</h2>
            <p>この度は、ミテルンデスのプレスモード申請をいただき、誠にありがとうございます。</p>
            <p>以下の内容で申請を受け付けました。</p>
            <table style="border-collapse: collapse; width: 100%; margin: 20px 0; border: 1px solid #ddd;">
              <tr style="border-bottom: 1px solid #ddd;"><td style="padding: 8px; font-weight: bold; background: #f5f5f5;">組織名</td><td style="padding: 8px;">${escapeHtml(organizationName)}</td></tr>
              <tr style="border-bottom: 1px solid #ddd;"><td style="padding: 8px; font-weight: bold; background: #f5f5f5;">組織種別</td><td style="padding: 8px;">${orgTypeLabels[organizationType] || organizationType}</td></tr>
              <tr style="border-bottom: 1px solid #ddd;"><td style="padding: 8px; font-weight: bold; background: #f5f5f5;">ご担当者名</td><td style="padding: 8px;">${escapeHtml(contactPerson)}</td></tr>
              ${phone ? `<tr style="border-bottom: 1px solid #ddd;"><td style="padding: 8px; font-weight: bold; background: #f5f5f5;">電話番号</td><td style="padding: 8px;">${escapeHtml(phone)}</td></tr>` : ''}
              ${note ? `<tr><td style="padding: 8px; font-weight: bold; background: #f5f5f5;">備考</td><td style="padding: 8px;">${escapeHtml(note)}</td></tr>` : ''}
            </table>
            <p>2〜3営業日以内に審査を行い、承認後にIDおよびパスワードをメールにてお送りします。<br>今しばらくお待ちくださいますよう、お願い申し上げます。</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
            <p style="color: #666;">ミテルンデス<br>https://miterundesu.jp</p>`
        })
      ]);
    } catch (emailError) {
      console.error('Email sending error:', emailError);
    }

    res.status(201).json({
      success: true,
      message: '申請を受け付けました。\n2〜3営業日以内に審査を行い、承認後にIDおよびパスワードをメールにてお送りします。',
      data
    });
  } catch (error) {
    console.error('Press application error:', error);
    res.status(500).json({ error: '送信中にエラーが発生しました。' });
  }
});

// Press account application
app.post('/api/press-account-application', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, password, organizationName, organizationType, contactName, contactEmail, contactPhone, notes } = req.body;

    if (!userId || !password || !organizationName || !organizationType || !contactName || !contactEmail) {
      res.status(400).json({ error: 'すべての必須項目を入力してください。' });
      return;
    }

    const userIdRegex = /^[a-zA-Z0-9\-_]{4,20}$/;
    if (!userIdRegex.test(userId)) {
      res.status(400).json({ error: 'ユーザーIDは4〜20文字の半角英数字、ハイフン(-)、アンダースコア(_)で入力してください。' });
      return;
    }

    if (password.length < 8) {
      res.status(400).json({ error: 'パスワードは8文字以上で設定してください。' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactEmail)) {
      res.status(400).json({ error: '有効なメールアドレスを入力してください。' });
      return;
    }

    const { data: existing } = await supabase
      .from('press_accounts')
      .select('user_id')
      .eq('user_id', userId)
      .single();

    if (existing) {
      res.status(400).json({ error: 'このユーザーIDは既に使用されています。' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);

    const { data, error } = await supabase
      .from('press_accounts')
      .insert([{
        user_id: userId,
        password_hash: passwordHash,
        organization_name: organizationName,
        organization_type: organizationType,
        contact_person: contactName,
        email: contactEmail,
        phone: contactPhone || null,
        notes: notes || null,
        expires_at: expiresAt.toISOString(),
        is_active: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      res.status(500).json({ error: 'データベースエラーが発生しました。' });
      return;
    }

    res.status(201).json({
      success: true,
      message: 'アカウント申請を受け付けました。\n審査完了後（2-3営業日以内）、メールにてご連絡いたします。',
      data
    });
  } catch (error) {
    console.error('Press account error:', error);
    res.status(500).json({ error: '送信中にエラーが発生しました。' });
  }
});

export default app;
