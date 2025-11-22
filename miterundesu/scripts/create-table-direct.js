#!/usr/bin/env node

/**
 * Create press_accounts table directly using HTTP API
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env file');
  process.exit(1);
}

// Read migration SQL
const migrationPath = path.join(__dirname, '../supabase/migrations/20251121000000_create_press_accounts.sql');
const sql = fs.readFileSync(migrationPath, 'utf8');

console.log('🚀 Creating press_accounts table via Supabase API...\n');
console.log('📄 SQL Migration loaded\n');

// Parse Supabase URL
const hostname = supabaseUrl.replace('https://', '');
const projectRef = hostname.replace('.supabase.co', '');

// Use Supabase's SQL endpoint
const options = {
  hostname: `${projectRef}.supabase.co`,
  port: 443,
  path: '/rest/v1/rpc/exec_sql',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'apikey': supabaseServiceKey,
    'Authorization': `Bearer ${supabaseServiceKey}`,
    'Prefer': 'return=representation'
  }
};

const postData = JSON.stringify({
  query: sql
});

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    if (res.statusCode === 200 || res.statusCode === 201) {
      console.log('✅ Migration executed successfully!');
      console.log('\n📊 Response:', data);

      // Now run the setup script to create the review account
      console.log('\n🔄 Running account setup...\n');
      const { spawn } = require('child_process');
      const setup = spawn('node', [path.join(__dirname, 'setup-press-accounts.js')], {
        stdio: 'inherit'
      });

      setup.on('close', (code) => {
        process.exit(code);
      });
    } else {
      console.error(`❌ Request failed with status: ${res.statusCode}`);
      console.error('Response:', data);
      console.log('\n💡 The exec_sql function may not exist. Trying alternative method...\n');

      // Alternative: Print SQL for manual execution
      console.log('Please execute this SQL manually in Supabase Studio:');
      console.log('=' .repeat(80));
      console.log(sql);
      console.log('=' .repeat(80));
      console.log(`\nGo to: https://supabase.com/dashboard/project/${projectRef}/sql`);
      process.exit(1);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request error:', error.message);
  console.log('\n💡 Manual SQL execution required.');
  console.log('Please execute this SQL in Supabase Studio:');
  console.log('=' .repeat(80));
  console.log(sql);
  console.log('=' .repeat(80));
  console.log(`\nGo to: https://supabase.com/dashboard/project/${projectRef}/sql`);
  process.exit(1);
});

req.write(postData);
req.end();
