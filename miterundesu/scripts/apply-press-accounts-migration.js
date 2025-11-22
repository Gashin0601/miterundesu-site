#!/usr/bin/env node

/**
 * Apply press_accounts migration
 * Creates the new press_accounts table in Supabase
 */

const { createClient } = require('@supabase/supabase-js');
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
  db: { schema: 'public' },
  auth: { persistSession: false }
});

async function applyMigration() {
  console.log('🚀 Starting press_accounts migration...\n');

  try {
    // Read the migration SQL file
    const migrationPath = path.join(__dirname, '../supabase/migrations/20251121000000_create_press_accounts.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    console.log('📄 Migration file loaded');
    console.log(`📍 Path: ${migrationPath}\n`);

    // Split SQL into individual statements (simple split by semicolon)
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`📝 Found ${statements.length} SQL statements to execute\n`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';';

      // Skip comments and empty lines
      if (statement.trim().startsWith('--') || statement.trim() === ';') {
        continue;
      }

      console.log(`Executing statement ${i + 1}/${statements.length}...`);

      // Use REST API to execute SQL via Supabase
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ query: statement })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Failed to execute statement ${i + 1}`);
        console.error(`Status: ${response.status}`);
        console.error(`Error: ${errorText}`);
        console.log('\n💡 Trying alternative method...\n');

        // Alternative: Try using psql directly
        throw new Error('REST API execution failed');
      }

      console.log(`✅ Statement ${i + 1} executed successfully`);
    }

    console.log('\n✅ Migration completed successfully!');
    console.log('\n📊 Next steps:');
    console.log('1. Hash the review account password');
    console.log('2. Update the password_hash in the database');
    console.log('3. Test the authentication flow\n');

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.log('\n💡 Alternative: Execute SQL manually');
    console.log('1. Go to Supabase Studio: https://supabase.com/dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Copy and paste the migration file content');
    console.log('4. Execute the SQL\n');
    process.exit(1);
  }
}

applyMigration();
