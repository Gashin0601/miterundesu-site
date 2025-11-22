#!/usr/bin/env node

/**
 * Helper script to execute SQL migration in Supabase Studio
 * Opens the browser and copies SQL to clipboard
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;

if (!supabaseUrl) {
  console.error('❌ Error: SUPABASE_URL must be set in .env file');
  process.exit(1);
}

const projectRef = supabaseUrl.replace('https://', '').replace('.supabase.co', '');
const sqlEditorUrl = `https://supabase.com/dashboard/project/${projectRef}/sql`;

// Read migration SQL
const migrationPath = path.join(__dirname, '../supabase/migrations/20251121000000_create_press_accounts.sql');
const sql = fs.readFileSync(migrationPath, 'utf8');

console.log('🚀 Opening Supabase SQL Editor...\n');
console.log('📋 SQL has been copied to your clipboard!');
console.log('\n📝 Steps to execute:');
console.log('1. Browser will open to Supabase SQL Editor');
console.log('2. Paste the SQL (Cmd+V)');
console.log('3. Click "Run" button');
console.log('4. Return here and press Enter when done\n');

// Copy SQL to clipboard
exec(`echo ${JSON.stringify(sql)} | pbcopy`, (error) => {
  if (error) {
    console.error('⚠️  Could not copy to clipboard:', error.message);
    console.log('\nPlease copy this SQL manually:');
    console.log('=' .repeat(80));
    console.log(sql);
    console.log('=' .repeat(80));
  } else {
    console.log('✅ SQL copied to clipboard!\n');
  }

  // Open browser
  exec(`open "${sqlEditorUrl}"`, (error) => {
    if (error) {
      console.error('⚠️  Could not open browser:', error.message);
      console.log(`\nPlease open this URL manually: ${sqlEditorUrl}`);
    }
  });

  console.log('Press Enter after executing the SQL in Supabase Studio...');
  process.stdin.once('data', async () => {
    console.log('\n✅ Great! Now creating the review account...\n');

    // Run setup script
    const { spawn } = require('child_process');
    const setup = spawn('node', [path.join(__dirname, 'setup-press-accounts.js')], {
      stdio: 'inherit'
    });

    setup.on('close', (code) => {
      process.exit(code);
    });
  });
});
