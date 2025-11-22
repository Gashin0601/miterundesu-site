#!/usr/bin/env node

/**
 * Execute migration using PostgreSQL client
 * Direct database connection for reliable SQL execution
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;

if (!supabaseUrl) {
  console.error('❌ Error: SUPABASE_URL must be set in .env file');
  process.exit(1);
}

// Parse Supabase URL to get connection details
// Format: https://PROJECT_REF.supabase.co
const projectRef = supabaseUrl.replace('https://', '').replace('.supabase.co', '');
const dbPassword = process.env.SUPABASE_DB_PASSWORD;

// Supabase connection string format
const connectionString = `postgresql://postgres.${projectRef}:${dbPassword}@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres`;

async function executeMigration() {
  console.log('🚀 Executing press_accounts migration with PostgreSQL client...\n');

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    // Connect to database
    console.log('🔌 Connecting to Supabase database...');
    await client.connect();
    console.log('✅ Connected successfully\n');

    // Read migration file
    const migrationPath = path.join(__dirname, '../supabase/migrations/20251121000000_create_press_accounts.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    console.log('📄 Migration file loaded');
    console.log(`📝 Executing SQL...\n`);

    // Execute the entire migration
    await client.query(sql);

    console.log('✅ Migration completed successfully!\n');
    console.log('📊 press_accounts table created with:');
    console.log('   - User ID + Password authentication');
    console.log('   - RLS policies configured');
    console.log('   - Review account placeholder added\n');

    // Now create the actual review account with hashed password
    console.log('🔐 Creating review account with hashed password...');

    // We'll use bcrypt to hash the password
    const bcrypt = require('bcryptjs');
    const reviewPassword = 'ReviewPass2025';
    const passwordHash = await bcrypt.hash(reviewPassword, 10);

    await client.query(
      `UPDATE public.press_accounts
       SET password_hash = $1
       WHERE user_id = 'apple-review'`,
      [passwordHash]
    );

    console.log('✅ Review account password set successfully\n');
    console.log('📝 Review Account Credentials:');
    console.log('   User ID: apple-review');
    console.log('   Password: ReviewPass2025\n');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('\nError details:', error);
    process.exit(1);
  } finally {
    await client.end();
    console.log('🔌 Database connection closed');
  }
}

executeMigration();
