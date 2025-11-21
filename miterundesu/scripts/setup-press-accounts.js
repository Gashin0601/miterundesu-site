#!/usr/bin/env node

/**
 * Setup press_accounts system
 * This script will:
 * 1. Show the SQL migration to be executed manually in Supabase Studio
 * 2. Create the review account with hashed password
 */

const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false }
});

async function setupPressAccounts() {
  console.log('🚀 Setting up press_accounts system...\n');

  // Step 1: Show the migration SQL
  console.log('📋 STEP 1: Execute Migration SQL');
  console.log('=' .repeat(60));
  console.log('Please execute the following SQL in Supabase Studio:');
  console.log(`https://supabase.com/dashboard/project/${supabaseUrl.match(/https:\/\/(.+?)\.supabase\.co/)[1]}/sql`);
  console.log('=' .repeat(60));

  const migrationPath = path.join(__dirname, '../supabase/migrations/20251121000000_create_press_accounts.sql');
  const sql = fs.readFileSync(migrationPath, 'utf8');

  console.log('\n' + sql + '\n');
  console.log('=' .repeat(60));
  console.log('\nPress Enter after you have executed the SQL in Supabase Studio...');

  // Wait for user confirmation (in automated script, we skip this)
  // For now, let's assume the table exists and just try to insert

  console.log('\n📝 STEP 2: Creating review account...\n');

  try {
    // Check if table exists by trying to query it
    const { error: checkError } = await supabase
      .from('press_accounts')
      .select('id')
      .limit(1);

    if (checkError && checkError.code === '42P01') {
      console.error('❌ Error: press_accounts table does not exist yet');
      console.error('Please execute the migration SQL first in Supabase Studio\n');
      process.exit(1);
    }

    // Hash the review password
    const reviewPassword = 'ReviewPass2025';
    console.log('🔐 Hashing password...');
    const passwordHash = await bcrypt.hash(reviewPassword, 10);
    console.log('✅ Password hashed successfully\n');

    // Insert or update the review account
    const { data: existing } = await supabase
      .from('press_accounts')
      .select('*')
      .eq('user_id', 'apple-review')
      .single();

    if (existing) {
      // Update existing
      console.log('📝 Updating existing review account...');
      const { error: updateError } = await supabase
        .from('press_accounts')
        .update({
          password_hash: passwordHash,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', 'apple-review');

      if (updateError) {
        throw updateError;
      }
      console.log('✅ Review account updated successfully\n');
    } else {
      // Insert new
      console.log('📝 Creating new review account...');
      const { error: insertError } = await supabase
        .from('press_accounts')
        .insert({
          user_id: 'apple-review',
          password_hash: passwordHash,
          organization_name: 'App Store Review Team',
          organization_type: 'other',
          contact_person: 'App Review',
          email: 'appstore-review@apple.com',
          approved_by: 'System',
          approved_at: new Date().toISOString(),
          expires_at: '2099-12-31T23:59:59Z',
          is_active: true
        });

      if (insertError) {
        throw insertError;
      }
      console.log('✅ Review account created successfully\n');
    }

    console.log('🎉 Setup completed!\n');
    console.log('📝 Review Account Credentials:');
    console.log('   User ID: apple-review');
    console.log('   Password: ReviewPass2025');
    console.log('\n💡 Use these credentials for App Store review\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === '42P01') {
      console.error('\nThe press_accounts table does not exist.');
      console.error('Please execute the migration SQL first in Supabase Studio.');
    }
    process.exit(1);
  }
}

setupPressAccounts();
