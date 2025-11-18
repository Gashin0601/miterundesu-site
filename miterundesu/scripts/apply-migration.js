#!/usr/bin/env node

/**
 * Apply Supabase Migration
 * Executes SQL migration files using direct Postgres connection
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Parse Supabase URL to get connection details
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  console.error('❌ Error: SUPABASE_URL must be set in .env file');
  process.exit(1);
}

// Extract project ref from URL: https://PROJECT_REF.supabase.co
const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)[1];

// Construct database connection URL
// Format: postgres://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres
const dbPassword = process.env.SUPABASE_DB_PASSWORD;

if (!dbPassword) {
  console.error('❌ Error: SUPABASE_DB_PASSWORD must be set in .env file');
  console.log('\n💡 How to get your database password:');
  console.log('  1. Go to https://supabase.com/dashboard/project/' + projectRef + '/settings/database');
  console.log('  2. Find the "Connection string" section');
  console.log('  3. Copy the password from the connection string');
  console.log('  4. Add SUPABASE_DB_PASSWORD=your_password to .env file');
  process.exit(1);
}

const connectionString = `postgresql://postgres.${projectRef}:${dbPassword}@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres`;

async function applyMigration(migrationFile) {
  console.log(`\n📄 Applying migration: ${path.basename(migrationFile)}\n`);

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    // Read the migration file
    const sql = fs.readFileSync(migrationFile, 'utf8');

    console.log('📝 SQL to execute:');
    console.log('━'.repeat(60));
    console.log(sql);
    console.log('━'.repeat(60));
    console.log('');

    // Connect to database
    console.log('🔌 Connecting to Supabase database...');
    await client.connect();
    console.log('✅ Connected!');

    // Execute the migration
    console.log('⚙️  Executing migration...');
    await client.query(sql);

    console.log('✅ Migration applied successfully!\n');
    return true;

  } catch (error) {
    console.error('❌ Error applying migration:', error.message);
    console.error('Details:', error);
    return false;
  } finally {
    await client.end();
  }
}

async function main() {
  const migrationFile = process.argv[2] ||
    path.join(__dirname, '../supabase/migrations/20251118000000_add_position_to_press_applications.sql');

  if (!fs.existsSync(migrationFile)) {
    console.error(`❌ Migration file not found: ${migrationFile}`);
    process.exit(1);
  }

  const success = await applyMigration(migrationFile);
  process.exit(success ? 0 : 1);
}

main();
