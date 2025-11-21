#!/usr/bin/env node

/**
 * Helper to execute press_accounts migration in Supabase Studio
 * Opens browser and copies SQL to clipboard
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
const sqlEditorUrl = `https://supabase.com/dashboard/project/${projectRef}/sql/new`;

// Read migration SQL
const migrationPath = path.join(__dirname, '../supabase/migrations/20251121000000_create_press_accounts.sql');
const sql = fs.readFileSync(migrationPath, 'utf8');

console.log('🚀 Opening Supabase SQL Editor...\n');
console.log('📝 IMPORTANT: Follow these steps carefully:\n');
console.log('1. ✅ SQL has been copied to your clipboard');
console.log('2. 🌐 Browser will open to Supabase SQL Editor');
console.log('3. 📋 Paste the SQL (Cmd+V / Ctrl+V)');
console.log('4. ▶️  Click the "Run" button (or press Cmd+Enter)');
console.log('5. ✅ Wait for "Success. No rows returned" message');
console.log('6. ↩️  Return here and press Enter\n');

// Copy SQL to clipboard (macOS) - write to temp file first to avoid shell escaping issues
const tmpFile = path.join(__dirname, '.migration-temp.sql');
fs.writeFileSync(tmpFile, sql, 'utf8');

exec(`cat "${tmpFile}" | pbcopy`, (error) => {
  // Clean up temp file
  try { fs.unlinkSync(tmpFile); } catch (e) {}

  if (error) {
    console.error('⚠️  Could not copy to clipboard automatically');
    console.log('\n📋 Please copy this SQL manually:');
    console.log('='.repeat(80));
    console.log(sql);
    console.log('='.repeat(80));
  } else {
    console.log('✅ SQL copied to clipboard!\n');
  }

  // Open browser
  exec(`open "${sqlEditorUrl}"`, (error) => {
    if (error) {
      console.error('⚠️  Could not open browser automatically');
      console.log(`\n🌐 Please open this URL manually: ${sqlEditorUrl}`);
    } else {
      console.log('🌐 Browser opened!\n');
    }
  });

  console.log('⏸️  Press Enter after the SQL executes successfully in Supabase...');
  process.stdin.once('data', async () => {
    console.log('\n🔍 Verifying table creation...\n');

    // Run check script
    const { spawn } = require('child_process');
    const check = spawn('node', [path.join(__dirname, 'check-table.js')], {
      stdio: 'inherit'
    });

    check.on('close', (code) => {
      if (code === 0 || code === false) {
        console.log('\n🔐 Now updating review account password...\n');

        // Run setup script to hash and update password
        const setup = spawn('node', [path.join(__dirname, 'setup-press-accounts.js')], {
          stdio: 'inherit'
        });

        setup.on('close', (setupCode) => {
          process.exit(setupCode);
        });
      } else {
        console.error('\n❌ Table verification failed. Please check the SQL execution in Supabase.');
        process.exit(1);
      }
    });
  });
});
