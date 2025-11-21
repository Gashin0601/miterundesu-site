/**
 * Form Submission API Endpoints
 * Handles all form submissions and saves to Supabase
 */

import { Router, Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { sendContactEmails, sendStoreApplicationEmails, sendPressApplicationEmails } from '../services/email';

dotenv.config();

const router = Router();

// Initialize Supabase client with service role key (server-side only)
const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

/**
 * POST /api/contact
 * Submit contact form
 */
router.post('/contact', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, inquiryType, message } = req.body;

    // Validation
    if (!name || !email || !inquiryType || !message) {
      res.status(400).json({
        error: 'すべての必須項目を入力してください。'
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        error: '有効なメールアドレスを入力してください。'
      });
      return;
    }

    // Insert into Supabase
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
      res.status(500).json({
        error: 'データベースエラーが発生しました。'
      });
      return;
    }

    // Send notification emails
    try {
      await sendContactEmails({
        name,
        email,
        inquiryType,
        message
      });
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Continue even if email fails
    }

    res.status(201).json({
      success: true,
      message: 'お問い合わせを受け付けました。2-3営業日以内にご連絡いたします。',
      data
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      error: '送信中にエラーが発生しました。もう一度お試しください。'
    });
  }
});

/**
 * POST /api/store-application
 * Submit store application form
 */
router.post('/store-application', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      storeName,
      industry,
      posterType,
      location,
      email,
      phone,
      note
    } = req.body;

    // Validation
    if (!storeName || !industry || !posterType) {
      res.status(400).json({
        error: 'すべての必須項目を入力してください。'
      });
      return;
    }

    // Email validation (if provided)
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        res.status(400).json({
          error: '有効なメールアドレスを入力してください。'
        });
        return;
      }
    }

    // Insert into Supabase
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
      res.status(500).json({
        error: 'データベースエラーが発生しました。'
      });
      return;
    }

    // Send notification emails
    try {
      await sendStoreApplicationEmails({
        storeName,
        industry,
        posterType,
        location,
        email,
        phone,
        note
      });
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Continue even if email fails
    }

    res.status(201).json({
      success: true,
      message: 'ご連絡ありがとうございます！\n受付完了メールをお送りしました。\n2〜3営業日以内に担当者よりご連絡させていただきます。',
      data
    });

  } catch (error) {
    console.error('Store application error:', error);
    res.status(500).json({
      error: '送信中にエラーが発生しました。もう一度お試しください。'
    });
  }
});

/**
 * POST /api/press-application
 * Submit press application form
 */
router.post('/press-application', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      mediaName,
      contactPerson,
      email,
      phone,
      coverageContent,
      publicationDate,
      requiredPeriodStart,
      requiredPeriodEnd,
      note
    } = req.body;

    // Validation
    if (!mediaName || !contactPerson || !email || !coverageContent) {
      res.status(400).json({
        error: 'すべての必須項目を入力してください。'
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        error: '有効なメールアドレスを入力してください。'
      });
      return;
    }

    // Insert into Supabase
    const { data, error } = await supabase
      .from('press_applications')
      .insert([{
        media_name: mediaName,
        contact_person: contactPerson,
        email,
        phone,
        coverage_content: coverageContent,
        publication_date: publicationDate || null,
        required_period_start: requiredPeriodStart || null,
        required_period_end: requiredPeriodEnd || null,
        note,
        status: 'pending'
      }])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      res.status(500).json({
        error: 'データベースエラーが発生しました。'
      });
      return;
    }

    // Send notification emails
    try {
      await sendPressApplicationEmails({
        mediaName,
        contactPerson,
        email,
        phone,
        coverageContent,
        publicationDate,
        requiredPeriodStart,
        requiredPeriodEnd,
        note
      });
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Continue even if email fails
    }

    res.status(201).json({
      success: true,
      message: '申請を受け付けました。\n2〜3営業日以内に担当者よりプレスコードをお送りします。',
      data
    });

  } catch (error) {
    console.error('Press application error:', error);
    res.status(500).json({
      error: '送信中にエラーが発生しました。もう一度お試しください。'
    });
  }
});

/**
 * POST /api/press-account
 * Create press account with user ID + password authentication
 */
router.post('/press-account', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      userId,
      password,
      organizationName,
      organizationType,
      contactPerson,
      email,
      phone,
      note
    } = req.body;

    // Validation
    if (!userId || !password || !organizationName || !organizationType || !contactPerson || !email) {
      res.status(400).json({
        error: 'すべての必須項目を入力してください。'
      });
      return;
    }

    // User ID validation
    const userIdRegex = /^[a-zA-Z0-9\-_]{4,20}$/;
    if (!userIdRegex.test(userId)) {
      res.status(400).json({
        error: 'ユーザーIDは4〜20文字の半角英数字、ハイフン(-)、アンダースコア(_)で入力してください。'
      });
      return;
    }

    // Password validation
    if (password.length < 8) {
      res.status(400).json({
        error: 'パスワードは8文字以上で設定してください。'
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        error: '有効なメールアドレスを入力してください。'
      });
      return;
    }

    // Organization type validation
    const validTypes = ['newspaper', 'tv', 'magazine', 'web_media', 'other'];
    if (!validTypes.includes(organizationType)) {
      res.status(400).json({
        error: '組織種別が正しくありません。'
      });
      return;
    }

    // Check if user ID already exists
    const { data: existing } = await supabase
      .from('press_accounts')
      .select('user_id')
      .eq('user_id', userId)
      .single();

    if (existing) {
      res.status(400).json({
        error: 'このユーザーIDは既に使用されています。別のユーザーIDをお試しください。'
      });
      return;
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Calculate expiration date (1 year from now)
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);

    // Insert into Supabase
    // Account is pending approval (is_active = false) until admin approves
    const { data, error } = await supabase
      .from('press_accounts')
      .insert([{
        user_id: userId,
        password_hash: passwordHash,
        organization_name: organizationName,
        organization_type: organizationType,
        contact_person: contactPerson,
        email,
        phone: phone || null,
        expires_at: expiresAt.toISOString(),
        is_active: false, // Pending approval
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      res.status(500).json({
        error: 'データベースエラーが発生しました。'
      });
      return;
    }

    // Send notification emails
    try {
      await sendPressApplicationEmails({
        mediaName: organizationName,
        contactPerson,
        email,
        phone,
        coverageContent: `組織種別: ${organizationType}\nユーザーID: ${userId}\n備考: ${note || 'なし'}`,
        publicationDate: null,
        requiredPeriodStart: null,
        requiredPeriodEnd: null,
        note: `【新システム】プレスアカウント申請\n\n承認が必要です。承認後、is_active = true に設定してください。`
      });
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Continue even if email fails
    }

    res.status(201).json({
      success: true,
      message: 'アカウント申請を受け付けました。\n審査完了後（2-3営業日以内）、メールにてご連絡いたします。\n承認後、設定したユーザーIDとパスワードでログインできるようになります。',
      data
    });

  } catch (error) {
    console.error('Press account creation error:', error);
    res.status(500).json({
      error: '送信中にエラーが発生しました。もう一度お試しください。'
    });
  }
});

export default router;
